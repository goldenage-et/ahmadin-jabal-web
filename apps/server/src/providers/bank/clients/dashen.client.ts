import { EBankCode, TOrderBasic } from "@repo/common";
import { IBankClient, IBankClientReceiptData } from "../bank.core";
import { z } from "zod";

export class Dashen implements IBankClient {

    readonly info = {
        name: "Dashen Bank S.C",
        code: EBankCode.DASHEN,
        description: "Dashen Bank",
        logoUrl: "https://www.cbe.com.ng/assets/images/logo.png",
        referenceLabel: "Transaction Reference",
        referencePlaceholder: "Enter Reference Number",
    }

    parseReference(reference: string) {
        const validate = z.string().safeParse(reference);
        return { success: validate.success, value: validate.data, error: validate.error?.message };
    }

    getReceiptUrl({ receiverAccountNumber, reference }: { receiverAccountNumber: string, reference: string }) {
        // const lastFourDigits = receiverAccountNumber.slice(5, receiverAccountNumber.length);
        return `https://receipt.dashensuperapp.com/receipt/${reference}`;
    }

    validateReceiverAccountNumber(receiverAccountNumber: string, receiptData: IBankClientReceiptData) {
        const receiverAccountMatch = receiptData.receiverAccountNumber === receiverAccountNumber;
        return { success: receiverAccountMatch, error: receiverAccountMatch ? null : 'Receiver Account Number does not match' };
    }

    parseReceiptFile(receiptData: string) {
        const paymentInfo: IBankClientReceiptData = {} as any;

        // Set bank defaults
        paymentInfo.senderBank = this.info.code;
        paymentInfo.receiverBank = this.info.code;

        // Extract Sender Name
        const senderNameMatch = receiptData.match(/Sender Name:\s*([^\n]+)/);
        if (senderNameMatch) {
            paymentInfo.senderName = senderNameMatch[1].trim();
        }

        // Extract Sender Bank
        paymentInfo.senderBank = 'Dashen Bank';

        // Extract Sender Account Number
        const senderAccountMatch = receiptData.match(/Sender Account Number:\s*([^\n]+)/);
        if (senderAccountMatch) {
            paymentInfo.senderAccountNumber = senderAccountMatch[1].trim();
        }

        // Extract Receiver Name
        const receiverNameMatch = receiptData.match(/Receiver Name:\s*([^\n]+)/);
        if (receiverNameMatch) {
            paymentInfo.receiverName = receiverNameMatch[1].trim();
        }

        // Extract Receiver Bank (Institution Name)
        const receiverBankMatch = receiptData.match(/Instituton Name:\s*([^\n]+)/);
        if (receiverBankMatch) {
            paymentInfo.receiverBank = receiverBankMatch[1].trim();
        }

        // Extract Receiver Account Number
        const receiverAccountMatch = receiptData.match(/Receiver Account Number:\s*([^\n]+)/);
        if (receiverAccountMatch) {
            paymentInfo.receiverAccountNumber = receiverAccountMatch[1].trim();
        }

        // Extract Narrative
        const narrativeMatch = receiptData.match(/Narrative:\s*([^\n]+)/);
        if (narrativeMatch) {
            paymentInfo.narrative = narrativeMatch[1].trim();
        }

        // Extract Payment Date & Time (Transaction Date)
        const paymentDateMatch = receiptData.match(/Transaction Date:\s*([^\n]+)/);
        if (paymentDateMatch) {
            paymentInfo.paymentDateTime = paymentDateMatch[1].trim();
        }

        // Extract Reference No (Transaction Reference)
        const referenceMatch = receiptData.match(/Transaction Reference:\s*([^\n]+)/);
        if (referenceMatch) {
            paymentInfo.referenceNo = referenceMatch[1].trim();
        }

        // Extract Transferred Amount (Transaction Amount)
        const transferredAmountMatch = receiptData.match(/Transaction Amount\s+ETB\s+([\d,]+\.?\d*)/);
        if (transferredAmountMatch) {
            paymentInfo.transferredAmount = transferredAmountMatch[1].trim() + ' ETB';
        }

        // Extract Commission (Service Charge)
        const commissionMatch = receiptData.match(/Service Charge\s+ETB\s+([\d,]+\.?\d*)/);
        if (commissionMatch) {
            paymentInfo.commission = commissionMatch[1].trim() + ' ETB';
        }

        // Extract VAT (15%)
        const vatMatch = receiptData.match(/VAT\s*\(15%\)\s+ETB\s+([\d,]+\.?\d*)/);
        if (vatMatch) {
            paymentInfo.vat = vatMatch[1].trim() + ' ETB';
        }

        // Extract Total Amount
        const totalAmountMatch = receiptData.match(/Total\s+ETB\s+([\d,]+\.?\d*)/);
        if (totalAmountMatch) {
            paymentInfo.totalAmount = totalAmountMatch[1].trim() + ' ETB';
        }

        return {
            success: true,
            data: paymentInfo,
            error: null
        }
    };
}