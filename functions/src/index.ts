import * as functions from "firebase-functions";
import { PaymentService } from "./paymentService";


export const processCardPayment = functions.https.onCall(async (data, context) => {

    return await new PaymentService().cardPayment(data.cardToken, data.itemPrice, data.cardholderName, data.email);

});

export const processSofortPayment = functions.https.onCall(async (data, context) => {

    return await new PaymentService().sofortPayment(data.itemPrice);

});


export const refund = functions.https.onCall(async (data, context) => {

    const token: string = data.token

    try {
        if (token.startsWith("pay")) {
            const res = await new PaymentService().refund(token, data.amount)
            console.log(res)
            return res

        } else if ((token.startsWith("sid"))) {
            const paymentId = await new PaymentService().getPaymentIdBySession(token)
            const res = await new PaymentService().refund(paymentId, data.amount)
            console.log(res)
            return res

        } else {

            throw "Token Not found or Invaild"

        }
    } catch (e) {
        return {
            "status": "error",
            "error": e
        }

    }

});




