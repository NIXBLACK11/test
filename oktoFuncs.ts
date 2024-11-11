import { OktoContextType, Order, OrderStatus, TransferTokens } from "okto-sdk-react";

const recipientPublicKey = 'FhNZ5dafuzZLQXixkvRd2FP4XsDvmPyzaHnQwEtA1mPT';

export const makeTransaction = async (
  okto: OktoContextType | null, 
  amount: string
): Promise<{ success: boolean; orderId?: string }> => {
    if (!okto) {
        console.error("Okto context is not available");
        return { success: false };
    }

    const transferData: TransferTokens = {
        network_name: 'SOLANA_DEVNET',
        token_address: '',
        recipient_address: recipientPublicKey,
        quantity: amount,
    };

    try {
        const order: Order = await okto.transferTokensWithJobStatus(transferData);
        console.log(`Transfer initiated. Order ID: ${order.order_id}`);
        return { success: true, orderId: order.order_id };
    } catch (error) {
        console.error("Error transferring SOL on devnet:", error);
        return { success: false };
    }
}

export const getTransactionStatus = async (
    okto: OktoContextType | null,
    orderId: string
): Promise<{ status: string; transactionHash?: string } | null> => {
    if (!okto) {
        console.error("Okto context is not available");
        return null;
    }

    try {
        const orderData = await okto.orderHistory({
            order_id: orderId,
            limit: 1,
            offset: 0
        });

        if (orderData.jobs && orderData.jobs.length > 0) {
            const order = orderData.jobs[0];
            return {
                status: order.status,
                transactionHash: order.transaction_hash
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching transaction status:", error);
        return null;
    }
}

export const waitForTransactionCompletion = async (
    okto: OktoContextType | null,
    orderId: string,
    maxAttempts: number,
    intervalMs: number
): Promise<{ success: boolean; transactionHash?: string }> => {
    let attempts = 0;

    while (attempts < maxAttempts) {
        const status = await getTransactionStatus(okto, orderId);
        console.log(attempts);
        console.log(status);
        
        if (!status) {
            return { success: false };
        }

        switch (status.status) {
            case OrderStatus.SUCCESS:
                return { 
                    success: true, 
                    transactionHash: status.transactionHash 
                };
            case OrderStatus.FAILED:
                return { 
                    success: false, 
                    transactionHash: status.transactionHash 
                };
            case OrderStatus.PENDING:
                await new Promise(resolve => setTimeout(resolve, intervalMs));
                attempts++;
                break;
            default:
                console.warn(`Unknown status: ${status.status}`);
                attempts++;
        }
    }

    return { success: false };
}

export const initiateTransfer = async (okto: OktoContextType | null, amount: string) => {
    const result = await makeTransaction(okto, amount);
    
    if (result.success && result.orderId) {
        // const status = await getTransactionStatus(okto, result.orderId);
        // console.log("Transaction status:", status);

        const finalResult = await waitForTransactionCompletion(okto, result.orderId, 60, 1000);
        if (finalResult.success) {
            console.log("Transaction completed successfully!");
            console.log("Transaction hash:", finalResult.transactionHash);
            return true;
        } else {
            console.log("Transaction failed or timed out");
            return false;
        }
    }
};