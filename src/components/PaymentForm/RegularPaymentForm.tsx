"use client";

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { Field, Form, Formik, FormikProps, useFormik } from "formik";
import React, { useMemo, useState } from "react";
import * as Yup from 'yup';
import { useRouter } from 'next/navigation'

const formatProducts = (data:any) => {
    let products = data.data;

    let _products:any = [];
    // foreach product format the prices like above
    products.forEach((product:any) => {
        let _product:any = {};
        _product["id"] = product.id;
        _product["name"] = product.name;
        _product["description"] = product.description;
        _product["Weekly"] = {};
        _product["Monthly"] = {};
        _product['Fortnightly'] = {};

        // weekly prices
        product.prices.forEach((price:any) => {
            if(price.recurring.interval === "week") {
                if(price.recurring.interval_count === 2) {
                    _product["Fortnightly"][price.unit_amount / 100] = price.id;
                } else {
                    _product["Weekly"][price.unit_amount / 100] = price.id;
                }
            }
        });

        // monthly prices
        product.prices.forEach((price:any) => {
            if(price.recurring.interval === "month") {
                _product["Monthly"][price.unit_amount / 100] = price.id;
            }
        });

        _products.push(_product);
    });

    return _products;

    
    
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

const displayCauses = (products:any) => {

    return products.map((product:any) => {
        // eslint-disable-next-line react/jsx-key
        return <option value={product.id}>{product.name}</option>
    })

}

const displayFrequencies = (products:any, cause:any) => {
    
        let product = products.filter((product:any) => product.id === cause)[0];
        let frequencies = Object.keys(product);
        return frequencies.map((frequency:any) => {

            if(frequency === "id" || frequency === "name" || frequency === "description") {
                return;
            }

            // eslint-disable-next-line react/jsx-key
            return <option value={frequency}>{frequency}</option>
        })
}

const displayPrices = (products:any, cause:any, frequency:any) => {
    let product = products.filter((product:any) => product.id === cause)[0];
    let prices = product[frequency];

    //prices is an object
    return Object.keys(prices).map((price:any) => {
        // eslint-disable-next-line react/jsx-key
        return <option value={prices[price]}>{price}</option>
    })

}

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
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])

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

  useMemo(
    () => {
        const { data }:any = axios.get("/api/get-product").then((response) => {
            let _data = formatProducts(response.data);
            console.log("test",_data);
            setProducts(_data);
            setLoading(false);
        });
    },
    []
  );

  if(loading) {
        return <div className="animate-pulse">Loading...</div>
  }

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
                className=" flex gap-3 flex-col"
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
                    {!loading && displayCauses(products)}
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
                    {!loading && displayFrequencies(products, props.values.reason)}
                </Field>}
                {props.values.reason && props.values.frequency && 
                <Field 
                    as="select" 
                    name="amount"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                >
                    <option value="">Select an amount</option>
                    {props.values.frequency && props.values.reason && !loading && displayPrices(products, props.values.reason, props.values.frequency)}
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