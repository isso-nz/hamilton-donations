"use client";

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { useFormik } from "formik";
import React from "react";
import * as Yup from 'yup';
import { useRouter } from 'next/navigation'

export default function OncePaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const router = useRouter();

  const formatFee = () => {
    const _fee =  formik.values.amount * 0.025 + 0.30;
    return _fee.toFixed(2);
  }

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      eventName: "",
      amount: 20,
      fee: false,
      card: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      phone: Yup.string().required("Phone is required"),
      eventName: Yup.string(),
      amount: Yup.number().required("Amount is required").min(1, "Amount must be greater than 0"),
    }),
    onSubmit: async (values, actions) => {

      actions.setSubmitting(true);

      const cardElement = elements?.getElement("card");

      const reason = values.eventName ? `Donation for ${values.eventName}` : "General Donation";

      const _amount = values.fee ? Number(values.amount) + Number(formatFee()) : values.amount;

      try {
        if (!stripe || !cardElement) return null;
        const { data } = await axios.post("/api/create-payment-intent", {
          data: { 
            amount: _amount,
            meta: {
              first_name: values.firstName,
              last_name: values.lastName,
              email: values.email,
              phone: values.phone,
              event_name: values.eventName,
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
      }
    },
  });

  return (
    <div>
        <form className="max-w-screen-sm w-screen flex gap-3 flex-col px-5" onSubmit={formik.handleSubmit}> 
        {formik.isSubmitting ? 
          <div className="flex items-center p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 " role="alert">
          <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">We are creating your request</span> Give us a few seconds to process your request.
          </div>
        </div>: <></>}
        {formik.errors.card ? 
          <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 " role="alert">
            <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <span className="sr-only">Info</span>
            <div>
            <span className="font-medium">Error: </span>{formik.errors.card}
            </div>
          </div>
        : <></>}
          <div className="flex gap-3">
            <input
                name="firstName"
                required
                disabled={formik.isSubmitting}
                className="bg-gray-50 border disabled:opacity-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="First Name *"
                value={formik.values.firstName}
                onChange={formik.handleChange}
            />
            <input
                name="lastName"
                className="bg-gray-50 border disabled:opacity-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Last Name *"
                disabled={formik.isSubmitting}
                required
                value={formik.values.lastName}
                onChange={formik.handleChange}
            />
          </div>
          <input
              name="email"
              type="email"
              disabled={formik.isSubmitting}
              required
              className="bg-gray-50 border disabled:opacity-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
          />
          <input
              name="phone"
              required
              disabled={formik.isSubmitting}
              type="phone"
              className="bg-gray-50 border disabled:opacity-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
          />
          <input
              name="eventName"
              type="eventName"
              disabled={formik.isSubmitting}
              className="bg-gray-50 border disabled:opacity-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Reason for Donation"
              value={formik.values.eventName}
              onChange={formik.handleChange}
          />
          <div className="flex gap-4 items-center">
            <p 
              className="center font-bold text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
            >$</p>
            <input
                name="amount"
                className="bg-gray-50 border disabled:opacity-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="number"
                min={0}
                required
                disabled={formik.isSubmitting}
                value={formik.values.amount}
                placeholder="Amount"
                onChange={formik.handleChange}
            />
          </div>
          <CardElement
            className="bg-gray-50 border disabled:opacity-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          <div>
            <input 
              type="checkbox" 
              name="fee" 
              id="fee"
              disabled={formik.isSubmitting}
              className="disabled:opacity-50"
              checked={formik.values.fee}
              onChange={formik.handleChange}
            /> <label htmlFor="fee">Would you like to also add the payment fee of ${formatFee()}?</label>
          </div>
          <button 
            type="submit"
            disabled={!stripe || formik.isSubmitting}
            className="text-white disabled:opacity-50 disabled:cursor-not-allowed bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 "
          >Submit</button>
      </form>
    </div>
  );
}