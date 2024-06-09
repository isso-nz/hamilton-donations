"use client";

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { Field, Form, Formik, FormikProps, useFormik } from "formik";
import React from "react";
import * as Yup from 'yup';
import { useRouter } from 'next/navigation'

const productCodes:any = {
    aarti : {
        id:"prod_QDpRyeiqW2n4un",
        name: "Aarti",
        description: "Hamilton Mandir Weekly Aarti Contribution",
        weekly: {
            5: "price_1POb1yE3LNyFbiNyRILXo9f7",
            10: "price_1POb36E3LNyFbiNyb6zeCFbk",
            15: "price_1POb36E3LNyFbiNyxuz9kMK5",
            20: "price_1POb36E3LNyFbiNyfAZC09aZ"
        },
        monthly: {
            30: "price_1POb36E3LNyFbiNydqDxRHnk",
            40: "price_1POb36E3LNyFbiNyftAa0sDh",
            50: "price_1POb36E3LNyFbiNybpn7C0mm"
        }
    },
    camp2024: {
        id:"prod_QDpHSHHkpdxHqn",
        name: "Camp 2024 Donation Fund",
        description: "Hamilton Mandir Donation towards Camp 2024",
        weekly: {
            10: "price_1PPZRtE3LNyFbiNycBlF4naG",
            15: "price_1PPZS5E3LNyFbiNyDpqY9hz0",
            30: "price_1PPZSCE3LNyFbiNy3vBiB8RC"
        },
        monthly: {
            30: "price_1PPZSJE3LNyFbiNyL8nAG6Ua",
            50: "price_1PPZSNE3LNyFbiNyQQX8l6Kg",
            70: "price_1PPZSRE3LNyFbiNyJzsyveWy"
        }
    }
}

const validationSchema =  Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phone: Yup.string().required("Phone is required"),
    reason: Yup.string().required("Please select a cause"),
    frequency: Yup.string().required("Please select a frequency"),
    amount: Yup.string().required("Please select an amount"),
})

//get all the causes from the productCodes.names
const causes = Object.keys(productCodes).map((key) => {
    return {
        value: key,
        label: productCodes[key].name
    }
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

export default function OncePaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const router = useRouter();


  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    reason: "",
    otherReason: "",
    amount: "",
    frequency: "",
    fee: false,
    card: "",
  };

  return (
    <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, actions) => {
            try {

                const cardElement = elements?.getElement("card");

                if (!stripe || !cardElement) return null;

                const customer = await axios.post("/api/create-customer", {
                    data: { 
                      name: `${values.firstName} ${values.lastName}`,
                      email: values.email,
                    },
                  });

                const { data } = await axios.post("/api/send-for-subscription", {
                data: { 
                    item: values.amount,
                    customer_id: customer.data,
                },
                });

                const clientSecret = data.data.clientSecret;

                console.log("clientSecret",clientSecret);
                

                const result:any = await stripe?.confirmCardPayment(
                    clientSecret, 
                    {
                        payment_method: {
                            card: cardElement,
                            billing_details: {
                                name: `${values.firstName} ${values.lastName}`,
                                email: values.email,
                            },
                        }
                    }
                )

                if(result.error) {
                    console.log(result.error.message);
                    actions.setErrors({ card: result.error.message });
                    actions.setSubmitting(false);
                  }

                if(result.paymentIntent.status === "succeeded") {
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
                    as="select" 
                    name="reason"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                >
                    <option value="">Select a cause</option>
                    {causes.map((cause) => (
                        // eslint-disable-next-line react/jsx-key
                        <option value={cause.value}>{cause.label}</option>
                    ))}
                </Field>
                <span
                    className=" h-0.5 bg-gray-300 rounded-md block"
                />
                {props.values.reason && 
                <Field 
                    as="select" 
                    name="frequency"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                >
                    <option value="">Select a frequency</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </Field>}
                {props.values.reason && props.values.frequency && 
                <Field 
                    as="select" 
                    name="amount"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                >
                    <option value="">Select an amount</option>
                    {props.values.frequency && props.values.reason && Object.keys(productCodes[props.values.reason][props.values.frequency]).map((amount) => (
                        // eslint-disable-next-line react/jsx-key
                        <option value={productCodes[props.values.reason][props.values.frequency][amount]}>{amount}</option>
                    ))}
                </Field>}
                <CardElement
                  className="bg-gray-50 border disabled:opacity-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                <button 
                    type="submit"
                    disabled={!stripe || props.isSubmitting}
                    className="text-white disabled:opacity-50 disabled:cursor-not-allowed bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 "
                >Submit</button>
            </Form>
        )}
    </Formik>
  );
}