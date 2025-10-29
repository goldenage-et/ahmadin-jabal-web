import { EBankCode, TOrderBasic } from "@repo/common";
import { IBankClient, IBankClientReceiptData } from "../bank.core";
import { z } from "zod";

export class Cbe implements IBankClient {

    readonly info = {
        name: "Commercial Bank of Ethiopia",
        code: EBankCode.CBE,
        description: "Commercial Bank of Ethiopia",
        logoUrl: "https://www.cbe.com.ng/assets/images/logo.png",
        referenceLabel: "Reference No. (VAT Invoice No)",
        referencePlaceholder: "Enter Reference Number",
    }

    parseReference(reference: string) {
        const validate = z.string().safeParse(reference);
        return { success: validate.success, value: validate.data, error: validate.error?.message };
    }

    getReceiptUrl({ receiverAccountNumber, reference }: { receiverAccountNumber: string, reference: string }) {
        const lastFourDigits = receiverAccountNumber.slice(5, receiverAccountNumber.length);
        return `https://apps.cbe.com.et:100/BranchReceipt/${reference}&${lastFourDigits}`;
    }

    validateReceiverAccountNumber(receiverAccountNumber: string, receiptData: IBankClientReceiptData) {
        const lastFourDigits = receiverAccountNumber.slice(receiverAccountNumber.length - 4, receiverAccountNumber.length);
        const receiverAccountMatch = receiptData.receiverAccountNumber.endsWith(lastFourDigits);
        return { success: receiverAccountMatch, error: receiverAccountMatch ? null : 'Receiver Account Number does not match' };
    }

    parseReceiptFile(receiptData: string) {
        const paymentInfo: IBankClientReceiptData = {} as any;

        // Set bank defaults
        paymentInfo.senderBank = this.info.code;
        paymentInfo.receiverBank = this.info.code;

        // Extract Payer
        const payerMatch = receiptData.match(/Payer\s+([^\n]+)/);
        if (payerMatch) {
            paymentInfo.senderName = payerMatch[1].trim();
        }

        // Extract Payer Account
        const payerAccountMatch = receiptData.match(/Account\s+([^\n]+)/);
        if (payerAccountMatch) {
            paymentInfo.senderAccountNumber = payerAccountMatch[1].trim();
        }

        // Extract Receiver
        const receiverMatch = receiptData.match(/Receiver\s+([^\n]+)/);
        if (receiverMatch) {
            paymentInfo.receiverName = receiverMatch[1].trim();
        }

        // Extract Receiver Account (second Account match)
        const accountMatches = receiptData.match(/Account\s+([^\n]+)/g);
        if (accountMatches && accountMatches.length > 1) {
            paymentInfo.receiverAccountNumber = accountMatches[1].replace('Account ', '').trim();
        }

        // Extract Payment Date & Time
        const paymentDateMatch = receiptData.match(/Payment Date & Time\s+([^\n]+)/);
        if (paymentDateMatch) {
            paymentInfo.paymentDateTime = paymentDateMatch[1].trim();
        }

        // Extract Reference No
        const referenceMatch = receiptData.match(/Reference No\.\s*\([^)]+\)\s+([^\n]+)/);
        if (referenceMatch) {
            paymentInfo.referenceNo = referenceMatch[1].trim();
        }

        // Extract Reason/Type
        const reasonMatch = receiptData.match(/Reason\s*\/\s*Type of service\s+([^\n]+)/);
        if (reasonMatch) {
            paymentInfo.narrative = reasonMatch[1].trim();
        }

        // Extract Transferred Amount
        const transferredAmountMatch = receiptData.match(/Transferred Amount\s+([^\n]+)/);
        if (transferredAmountMatch) {
            paymentInfo.transferredAmount = transferredAmountMatch[1].trim();
        }

        // Extract Commission
        const commissionMatch = receiptData.match(/Commission or Service Charge\s+([^\n]+)/);
        if (commissionMatch) {
            paymentInfo.commission = commissionMatch[1].trim();
        }

        // Extract VAT
        const vatMatch = receiptData.match(/15%\s*VAT on Commission\s+([^\n]+)/);
        if (vatMatch) {
            paymentInfo.vat = vatMatch[1].trim();
        }

        // Extract Total Amount
        const totalAmountMatch = receiptData.match(/Total amount debited from customers account\s+([^\n]+)/);
        if (totalAmountMatch) {
            paymentInfo.totalAmount = totalAmountMatch[1].trim();
        }

        // Validate required fields
        if (!paymentInfo.senderName || !paymentInfo.transferredAmount || !paymentInfo.referenceNo) {
            return {
                success: false,
                data: paymentInfo,
                error: 'Missing required fields in receipt (sender name, amount, or reference)'
            };
        }

        return {
            success: true,
            data: paymentInfo,
            error: null
        }
    };
}