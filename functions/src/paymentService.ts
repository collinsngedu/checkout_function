import { Utils } from './utils';

export class PaymentService {

    async idPayment(insToken: string, itemPrice: number, customerId: string) {

        const res = await Utils.checkout.payments.request(
            {
                "source": {
                    "type": "id",
                    "id": insToken
                },
                "customer": { "id": customerId },
                "amount": itemPrice * 100,
                "currency": "EUR",
                "success_url": "http://localhost:3000/success",
                "failure_url": "http://localhost:3000/failed"

            },
        )

        const data = res as any
        console.log(data)

        if (data.status == "Pending") {
            return {
                "status": data.status,
                "redirectLink": data._links.redirect.href
            }
        } else {
            return {
                "status": data.status,
                "id": data.id

            }
        }
    }

    async cardPayment(cardToken: string, itemPrice: number, cardholderName: string, email: string) {

        const res = await Utils.checkout.payments.request(
            {
                "source": {
                    "type": "token",
                    "token": cardToken
                },
                "amount": itemPrice * 100,
                "currency": "EUR",
                "success_url": "http://localhost:3000/success",
                "failure_url": "http://localhost:3000/failed"

            },
        )

        const data = res as any
        console.log(data)

        if (data.status == "Pending") {
            return {
                "status": data.status,
                "redirectLink": data._links.redirect.href
            }
        } else {
            return {
                "status": data.status,
                "id": data.id

            }
        }
    }

    async sofortPayment(itemPrice: number) {

        const res = await Utils.checkout.payments.request(
            {
                "source": {
                    "type": "sofort"
                },
                "amount": itemPrice * 100,
                "currency": "EUR",
                "success_url": "http://localhost:3000/success",
                "failure_url": "http://localhost:3000/failed"
            }
        )

        const data = res as any
        console.log(data)

        return {
            "redirectLink": data._links.redirect.href
        }

    }

    async refund(paymentId: string, refundAmount: number) {
        const res = await Utils.checkout.payments.refund(paymentId, { amount: refundAmount * 100 })

        const data = res as any

        console.log(data)

        if (data.action_id != null) {
            return {
                "status": "refund_success"
            }
        } else {
            throw data.error_type
        }


    }

    async getPaymentIdBySession(sessionToken: string) {
        const res = await Utils.checkout.payments.get(sessionToken)

        const data = res as any

        console.log(data)

        if (data.id != null) {
            return data.id as string
        } else {
            throw "The id not found"
        }

    }

    async getCustomer(customerId: string) {
        const res = await Utils.checkout.customers.get(customerId);

        return res
    }
}




