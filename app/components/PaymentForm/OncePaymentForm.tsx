"use client";

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { Field, Form, Formik, FormikProps } from "formik";
import React from "react";
import * as Yup from 'yup';
import { useRouter } from 'next/navigation'

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  eventName: "",
  amount: 20,
  fee: false,
  card: "",
  installment :"0",
  installmentEnd: "",
};

const validationSchema =  Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  eventName: Yup.string(),
  amount: Yup.number().required("Amount is required").min(1, "Amount must be greater than 0"),
})

const displayErrors = (errors:any) => {

  console.log(errors);
  

  return <div>
    {
      Object.keys(errors).map((key, index) => {
        return <div key={index} className="text-red-800">{errors[key]}</div>
      })
    }
  </div>
}

const formatFee = (value:any) => {
  const _fee =  value * 0.025 + 0.30;
  return _fee.toFixed(2);
}

export default function OncePaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const router = useRouter();

  return (
    <div>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, actions) => {

              actions.setSubmitting(true);
        
              const cardElement = elements?.getElement("card");
        
              const reason = values.eventName ? `Donation for ${values.eventName}` : "General Donation";
        
              const _amount = values.fee ? Number(values.amount) + Number(formatFee(values.amount)) : values.amount;
        
              try {
                if (!stripe || !cardElement) return null;

                const customer = await axios.post("/api/create-customer", {
                  data: { 
                    name: `${values.firstName} ${values.lastName}`,
                    email: values.email,
                  },
                });

                const { data } = await axios.post("/api/create-payment-intent", {
                  data: { 
                    amount: _amount,
                    meta: {
                      first_name: values.firstName,
                      last_name: values.lastName,
                      email: values.email,
                      phone: values.phone,
                      event_name: values.eventName,
                      customer_id: customer.data,
                    },
                    description: reason,
                  },
                });
                const clientSecret = data;
        
                const result = await stripe?.confirmCardPayment(clientSecret, {
                  payment_method: { card: cardElement },
                });
        
                if(result.error) {
                  console.log(result.error.message);
                  actions.setErrors({ card: result.error.message });
                  actions.setSubmitting(false);
                }
        
                const {paymentIntent}:any = result;
        
                if(paymentIntent.status === "succeeded") {
                  router.push("/success");
                } else {
                  router.push("/help");
                }
              } catch (error) {
                console.log(error);
                actions.setSubmitting(false);
              }
            }}
        >
          {(props: FormikProps<any> ) => (
            <Form
              className="max-w-screen-sm w-screen flex gap-3 flex-col px-5"
            >
              {props.isSubmitting ? 
                <div className="flex items-center p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 " role="alert">
                <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                </svg>
                <span className="sr-only">Info</span>
                <div>
                  <span className="font-medium">We are creating your request</span> Give us a few seconds to process your request.
                </div>
              </div>: <></>}
              {props.errors && props.submitCount && !props.isSubmitting ? 
                <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 " role="alert">
                  <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                  </svg>
                  <span className="sr-only">Error</span>
                  <div>
                    <span className="font-bold">Error!</span>
                    {displayErrors(props.errors)}
                  </div>
                </div>
              : <></>}
              <div className="flex gap-3">
                    <Field 
                        type="text" 
                        name="firstName" 
                        placeholder="First Name *" 
                        className="bg-gray-50 border disabled:opacity-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                    <Field 
                        type="text" 
                        name="lastName" 
                        placeholder="Last Name *" 
                        className="bg-gray-50 border disabled:opacity-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                </div>
                <Field 
                    type="email" 
                    name="email" 
                    placeholder="Email *" 
                    className="bg-gray-50 border disabled:opacity-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                <Field 
                    type="phone" 
                    name="phone" 
                    placeholder="Phone *" 
                    className="bg-gray-50 border disabled:opacity-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                <Field 
                    type="text" 
                    name="eventName" 
                    placeholder="Reason for Donation"
                    className="bg-gray-50 border disabled:opacity-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                <div className="flex gap-4 items-center">
                  <p 
                    className="center font-bold text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
                  >$</p>
                  <Field 
                    type="number" 
                    name="amount" 
                    placeholder="Amount to donate*"
                    className="bg-gray-50 border disabled:opacity-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                </div>
                <CardElement
                  className="bg-gray-50 border disabled:opacity-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                {props.values.installment === "0" && (
                  <div>
                    <Field 
                      type="checkbox" 
                      name="fee" 
                      id="fee"
                      className="disabled:opacity-50"
                    /> <label htmlFor="fee">Would you like to also add the payment fee of ${formatFee(props.values.amount)}?</label>
                  </div>
                )}
                <button 
                  type="submit"
                  disabled={!stripe || props.isSubmitting}
                  className="text-white disabled:opacity-50 disabled:cursor-not-allowed bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 "
                >Submit</button>
            </Form>
          )}
        </Formik>
    </div>
  );
}