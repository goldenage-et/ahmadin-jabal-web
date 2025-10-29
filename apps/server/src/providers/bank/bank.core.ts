import { BadRequestException, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { TBankClientReceiptData, TOrderBasic, TValidateReference } from "@repo/common";
import * as fs from 'fs';
import * as https from 'https';
import { PDFParse } from 'pdf-parse';

export interface IBankClientReceiptData {
    senderName: string;
    senderBank: string;
    senderAccountNumber: string;

    receiverName: string;
    receiverBank: string;
    receiverAccountNumber: string;

    narrative: string;

    paymentDateTime: string;
    referenceNo: string;

    transferredAmount: string;
    commission: string;
    vat: string;
    totalAmount: string;
}

export interface IBankClient {
    readonly info: {
        name: string;
        code: string;
        description: string;
        logoUrl: string;
        referenceLabel: string;
        referencePlaceholder: string;
    };
    parseReference: (reference: string) => { success: boolean; value?: string, error?: string }
    getReceiptUrl: ({ receiverAccountNumber, reference }: { receiverAccountNumber: string; reference: string }) => string;
    parseReceiptFile: (receiptData: string) => {
        success: boolean;
        data: IBankClientReceiptData;
        error: string | null;
    };
    validateReceiverAccountNumber: (receiverAccountNumber: string, receiptData: IBankClientReceiptData) => { success: boolean, error: string | null }
}


export abstract class BankClientBase {
    readonly clients: IBankClient[] = [];
    private readonly logger = new Logger(BankClientBase.name);

    getBankClients = () => {
        return this.clients.map((bank) => bank.info);
    }

    getBankClientByCode = (code: string) => {
        return this.clients.find((bank) => bank.info.code === code);
    }

    validateReference = (data: TValidateReference) => {
        const client = this.getBankClientByCode(data.bankCode);
        console.log(client);
        if (!client) {
            throw new NotFoundException(`Bank with code "${data.bankCode}" not found`);
        }

        console.log(client.info);


        // Validate reference format
        const result = client.parseReference(data.reference);
        if (!result.success) {
            throw new BadRequestException(result.error || 'Invalid reference format');
        }

        return result;
    }

    getReceiptUrl = (data: TValidateReference, receiver: { bank: string; name: string; accountNumber: string }) => {
        const client = this.getBankClientByCode(data.bankCode);
        if (!client) {
            throw new NotFoundException(`Bank with code "${data.bankCode}" not found`);
        }
        return client.getReceiptUrl({
            receiverAccountNumber: receiver.accountNumber,
            reference: data.reference,
        });
    }

    async downloadReceiptFile(url: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            // Create custom HTTPS agent that allows self-signed certificates
            // Note: In production, you should use proper SSL certificates
            const agent = new https.Agent({
                rejectUnauthorized: false, // Allow self-signed certificates
            });

            const options = {
                agent,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'application/pdf',
                },
            };

            https.get(url, options, (response) => {
                // Check for redirect
                if (response.statusCode === 301 || response.statusCode === 302) {
                    const redirectUrl = response.headers.location;
                    if (redirectUrl) {
                        // Follow redirect
                        https.get(redirectUrl, options, (redirectResponse) => {
                            if (redirectResponse.statusCode !== 200) {
                                reject(new BadRequestException(
                                    `The receipt may not exist or the reference number is invalid.`
                                ));
                                return;
                            }

                            const chunks: Buffer[] = [];
                            redirectResponse.on('data', (chunk) => chunks.push(chunk));
                            redirectResponse.on('end', () => resolve(Buffer.concat(chunks)));
                            redirectResponse.on('error', (err) => reject(err));
                        }).on('error', (err) => reject(err));
                        return;
                    }
                }

                // Check status code
                if (response.statusCode !== 200) {
                    reject(new BadRequestException(
                        `The receipt may not exist or the reference number is invalid.`
                    ));
                    return;
                }

                // Collect response data
                const chunks: Buffer[] = [];
                response.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                response.on('end', () => {
                    const buffer = Buffer.concat(chunks);

                    // Validate it's actually a PDF
                    if (buffer.length === 0) {
                        reject(new BadRequestException('Received empty file from server'));
                        reject(new InternalServerErrorException("Internal Server Error"))
                        return;
                    }

                    // Check PDF header
                    const header = buffer.toString('utf8', 0, 4);
                    if (header !== '%PDF') {
                        reject(new BadRequestException(
                            'The receipt may not be available yet.'
                        ));
                        return;
                    }

                    resolve(buffer);
                });

                response.on('error', (err) => {
                    reject(new BadRequestException(
                        `${err.message}`
                    ));
                });
            }).on('error', (err) => {
                if (err.message.includes('ENOTFOUND')) {
                    this.logger.log('Bank server not found. Please check your internet connection.');
                    reject(new InternalServerErrorException("Internal Server Error"))
                } else if (err.message.includes('ETIMEDOUT')) {
                    this.logger.log('Connection to bank server timed out. Please try again later.');
                    reject(new InternalServerErrorException("Internal Server Error"))
                } else if (err.message.includes('UNABLE_TO_VERIFY_LEAF_SIGNATURE')) {
                    this.logger.log('SSL certificate verification failed. This may be a temporary issue with the bank server.');
                    reject(new InternalServerErrorException("Internal Server Error"))
                } else {
                    this.logger.log(`Network error: ${err.message}`);
                    reject(new InternalServerErrorException("Internal Server Error"))
                }
            });
        });
    }

    async getReceiptData(
        bankCode: string,
        fileBuffer: Buffer,
        reference: string
    ): Promise<{
        success: boolean;
        value?: string;
        error?: string;
        receiptData?: TBankClientReceiptData;
    }> {
        try {
            const client = this.getBankClientByCode(bankCode);
            if (!client) {
                throw new NotFoundException(`Bank with code "${bankCode}" not found`);
            }

            this.logger.log(`Parsing PDF with size: ${fileBuffer.length} bytes`);
            // Parse PDF with options
            let pdfData;
            try {
                const parser = new PDFParse({ data: fileBuffer });
                pdfData = await parser.getText();
            } catch (pdfError: any) {
                this.logger.log(`PDF Parse Error: ${pdfError.message}`);
                throw new InternalServerErrorException("Internal Server Error")
            }

            // Check if we got any text
            if (!pdfData.text || pdfData.text.trim().length === 0) {
                this.logger.log(
                    'The receipt PDF contains no readable text. It may be an image-based PDF that requires OCR processing.'
                );
                throw new InternalServerErrorException("Internal Server Error")
            }

            this.logger.log(`Extracted text length: ${pdfData.text.length} characters`);

            // Parse the receipt file using bank-specific parser
            const parseResult = client.parseReceiptFile(pdfData.text);

            if (!parseResult.success || parseResult.error) {
                this.logger.error(`Receipt parsing failed: ${parseResult.error}`);

                // Log the text that failed to parse (first 1000 chars)
                this.logger.debug(`Failed text: ${pdfData.text.substring(0, 1000)}`);

                this.logger.log(
                    parseResult.error || 'Failed to extract payment information from receipt. The receipt format may not be recognized.'
                );

                throw new InternalServerErrorException("Internal Server Error")
            }

            this.logger.log(`Successfully extracted receipt data for reference: ${reference}`);

            return {
                success: true,
                value: reference,
                receiptData: parseResult.data
            };
        } catch (error: any) {
            this.logger.error(`Error in getReceiptData: ${error.message}`, error.stack);

            this.logger.log(
                error instanceof BadRequestException
                    ? error.message
                    : `Failed to parse PDF receipt: ${error.message || 'Unknown error'}`
            );
            throw new InternalServerErrorException("Internal Server Error")

        }
    }

    async clearReceiptFile(filePath: string) {
        if (fs.existsSync(filePath)) {
            fs.rmSync(filePath);
        }
    }
}