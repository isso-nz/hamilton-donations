"use client";

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { Field, Form, Formik, FormikProps, useFormik } from "formik";
import React from "react";
import * as Yup from 'yup';
import { useRouter } from 'next/navigation'

export default function OncePaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    reason: "",
    otherReason: "",
    amount: 20,
    frequency: "weekly",
    fee: false,
    card: "",
  };

  return (
    <Formik
        initialValues={initialValues}
        onSubmit={async (values, actions) => {
            alert("Form submitted!")
        }}
    >
        {(props: FormikProps<any> ) => (
            <Form
                className="max-w-screen-sm w-screen flex gap-3 flex-col px-5"
            >
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
                    <option value="general">General</option>
                    <option value="aarti">Aarti</option>
                    <option value="food">Food</option>
                    <option value="other">Other</option>
                </Field>
                {props.values.reason === "other" && (
                    <Field 
                        type="text" 
                        required={props.values.reason === "other"}
                        name="otherReason" 
                        placeholder="Other reason *" 
                        className="bg-gray-50 border disabled:opacity-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                )}
                <span
                    className=" h-0.5 bg-gray-300 rounded-md block"
                />
                <Field 
                    as="select" 
                    name="frequency"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                >
                    <option value="">Select a frequency</option>
                    <option value="general">Weekly</option>
                    <option value="aarti">Aarti</option>
                    <option value="food">Food</option>
                    <option value="other">Other</option>
                </Field>
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