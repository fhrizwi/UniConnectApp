import React, { useState } from "react";
import { CreditCard, Smartphone, Wallet, ArrowLeft, Check, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Payment({ event, onPaymentSuccess, onCancel }) {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    upiId: "",
    name: ""
  });

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: CreditCard },
    { id: "upi", name: "UPI Payment", icon: Smartphone },
    { id: "wallet", name: "Wallet", icon: Wallet }
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert("Please select a payment method");
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      
      // Show success animation for 2 seconds, then call success callback
      setTimeout(() => {
        onPaymentSuccess();
      }, 2000);
    }, 2000);
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case "card":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expiry</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={paymentData.expiry}
                  onChange={(e) => setPaymentData({...paymentData, expiry: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        );
      case "upi":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">UPI ID</label>
              <input
                type="text"
                placeholder="yourname@upi"
                value={paymentData.upiId}
                onChange={(e) => setPaymentData({...paymentData, upiId: e.target.value})}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        );
      case "wallet":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Wallet Provider</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Paytm</option>
                <option>PhonePe</option>
                <option>Google Pay</option>
                <option>Amazon Pay</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
              <input
                type="text"
                placeholder="9876543210"
                value={paymentData.name}
                onChange={(e) => setPaymentData({...paymentData, name: e.target.value})}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onCancel}
            className="rounded-lg p-2 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
          <h2 className="text-xl font-bold text-slate-900">Payment</h2>
          <div className="w-9"></div>
        </div>

        {/* Event Summary */}
        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-slate-900">{event.title}</h3>
          <p className="text-sm text-slate-600 mt-1">{event.date} • {event.location}</p>
          <p className="text-lg font-bold text-indigo-600 mt-2">{event.price}</p>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h3 className="font-medium text-slate-900 mb-3">Select Payment Method</h3>
          <div className="space-y-2">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition ${
                    selectedMethod === method.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-5 w-5 text-slate-600" />
                  <span className="font-medium text-slate-900">{method.name}</span>
                  {selectedMethod === method.id && (
                    <Check className="h-5 w-5 text-indigo-600 ml-auto" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Form */}
        {selectedMethod && renderPaymentForm()}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={!selectedMethod || isProcessing}
            className={`flex-1 rounded-lg px-4 py-2 font-medium transition ${
              !selectedMethod || isProcessing
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {isProcessing ? "Processing..." : `Pay ${event.price}`}
          </button>
        </div>
      </div>

      {/* Payment Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 bg-green-600 flex items-center justify-center z-50">
          <div className="text-center">
            {/* Animated Check Circle */}
            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-full border-8 border-white border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center animate-pulse">
                  <Check className="w-16 h-16 text-white animate-bounce" />
                </div>
              </div>
            </div>
            
            {/* Success Messages */}
            <h2 className="text-3xl font-bold text-white mb-2 animate-pulse">Payment Successful!</h2>
            <p className="text-xl text-green-100 mb-4">₹{event.price.replace('₹', '').replace(' per team', '')}</p>
            <p className="text-lg text-green-200">You're now registered for {event.title}</p>
            
            {/* Loading dots animation */}
            <div className="flex justify-center mt-6 space-x-2">
              <Circle className="w-3 h-3 text-white animate-bounce" style={{ animationDelay: '0ms' }} />
              <Circle className="w-3 h-3 text-white animate-bounce" style={{ animationDelay: '150ms' }} />
              <Circle className="w-3 h-3 text-white animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
