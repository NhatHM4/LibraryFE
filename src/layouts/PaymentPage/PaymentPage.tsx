import { useEffect, useState } from "react";
import { useOktaAuth } from "@okta/okta-react";
import SpinLoading from "../Utils/SpinLoading";

import {toast } from 'react-toastify';



const PaymentPage = () => {
  const { authState } = useOktaAuth();
  const [httpError, setHttpError] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [fees, setFees] = useState(0);
  const [loadingFees, setLoadingFees] = useState(false);
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const vnp_ResponseCode = urlParams.get('vnp_ResponseCode');

    if (vnp_ResponseCode === "00") {
      const paymentComplete = async () => {
        if (authState && authState.isAuthenticated) {
          const url = `${process.env.REACT_APP_API}/payment/secure/payment_complete`;
          const requestOptions = {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${authState.accessToken?.accessToken}`,
              "Content-Type": "application/json",
            },
          };
          const paymentCompleteResponse = await fetch(url, requestOptions);
          if (!paymentCompleteResponse.ok) {
            throw new Error(" Something went wrong !!!");
          }
          setRefresh(!refresh)

          toast("Payment complete !!!" ,{
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        }
      };

      paymentComplete().catch((error: any) => {
        setLoadingFees(false);
        setHttpError(error.message);
      });

    
    }
  }, []);

  useEffect(() => {
    const fetchFee = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/payments/search/findByUserEmail?userEmail=${authState.accessToken?.claims.sub}`;
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        };
        const feesResponse = await fetch(url, requestOptions);
        if (!feesResponse.ok) {
          throw new Error(" Something went wrong !!!");
        }
        const feesResponseJson = await feesResponse.json();
        setFees(feesResponseJson.amount);
        setLoadingFees(false);
      }
    };
    fetchFee().catch((error: any) => {
      setLoadingFees(false);
      setHttpError(error.message);
    });
  }, [authState, refresh]);

  const handlePay = () => {
    const putReturnBook = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/payment/secure/create_payment?amount=${fees}`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };
        const PAYResponse = await fetch(url, requestOptions);
        if (!PAYResponse.ok) {
          throw new Error(" Something went wrong !!!");
        }
        const PAYResponseJSON = await PAYResponse.json();
        if (PAYResponseJSON.status == "OK"){
          window.location.href = PAYResponseJSON.url
        }
      }
    };

    putReturnBook().catch((error: any) => {
      throw new Error(" Return book fail !!");
    });
  };

  if (loadingFees) {
    return <SpinLoading />;
  }

  if (httpError) {
    return <div className="container m-5">{httpError}</div>;
  }

  return (
    <div className="container">
      {fees > 0 && (
        <div className="card mt-3">
          <h5 className="card-header">
            Fees pending: <span className="text-danger">{fees} VNĐ </span>
          </h5>
          <button
            disabled={submitDisabled}
            type="button"
            className="btn btn-btn-md main-color text-white mt-3"
            onClick={handlePay}
          >
            Pay fee
          </button>
        </div>
      )}
      {
        fees <= 0 &&
        <h1 className="navbar-brand">Nothing to Pay !!!</h1>
      }
    </div>
  );
};

export default PaymentPage;
