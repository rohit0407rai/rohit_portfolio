"use client";
import emailjs from 'emailjs-com';  // Importing the EmailJS library
import axios from 'axios';           // Importing Axios for additional API calls
import { useState } from 'react';    // Importing useState for managing form data
import { TbMailForward } from "react-icons/tb";  // Importing an icon for the send button
import { toast } from 'react-toastify'; // Importing toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Importing Toastify CSS

function ContactWithoutCaptcha() {
  // State to manage user input and error messages
  const [error, setError] = useState({ email: false, required: false });
  const [userInput, setUserInput] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Function to check if all required fields are filled
  const checkRequired = () => {
    if (userInput.email && userInput.message && userInput.name) {
      setError({ ...error, required: false });
    }
  };

  // Main function to handle form submission
  const handleSendMail = async (e) => {
    e.preventDefault();
    
    // Check if required fields are filled
    if (!userInput.email || !userInput.message || !userInput.name) {
      setError({ ...error, required: true });
      return;
    } else if (error.email) {
      return;
    }

    // Clear any previous error
    setError({ ...error, required: false });

    // Get environment variables for EmailJS
    const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const templateParams = {
      from_name: userInput.name,
      from_email: userInput.email,
      message: userInput.message + " from " + userInput.email,
    };

    try {
      // Send email via EmailJS
      const emailResponse = await emailjs.send(serviceID, templateID, templateParams, publicKey).then((val)=>{console.log(val)});

      // Make an additional API call via axios (optional)
      // const teleResponse = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/contact`, userInput);

      // Check if both the email and API calls were successful
      if (emailResponse.status === 200) {
        toast.success('Message sent successfully!');
        setUserInput({ name: '', email: '', message: '' }); // Clear form on success
      }
    } catch (error) {
      console.error("Error sending email:", error);
      // toast.error("Failed to send message. Please try again.");
      setUserInput({ name: '', email: '', message: '' }); 
    }
  };

  return (
    <div>
      <p className="font-medium mb-5 text-[#16f2b3] text-xl uppercase">
        Contact me
      </p>
      <div className="max-w-3xl text-white rounded-lg border border-[#464c6a] p-3 lg:p-5">
        <p className="text-sm text-[#d3d8e8]">
          If you have any questions or concerns, please do not hesitate to contact me.
        </p>
        
        <div className="mt-6 flex flex-col gap-4">
          {/* Name Input */}
          <div className="flex flex-col gap-2">
            <label className="text-base">Your Name: </label>
            <input
              className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] px-3 py-2"
              type="text"
              maxLength="100"
              required
              onChange={(e) => setUserInput({ ...userInput, name: e.target.value })}
              onBlur={checkRequired}
              value={userInput.name}
            />
          </div>

          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label className="text-base">Your Email: </label>
            <input
              className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] px-3 py-2"
              type="email"
              maxLength="100"
              required
              value={userInput.email}
              onChange={(e) => {
                setUserInput({ ...userInput, email: e.target.value });
                setError({ ...error, email: !isValidEmail(userInput.email) });
              }}
              onBlur={checkRequired}
            />
            {error.email && <p className="text-sm text-red-400">Please provide a valid email!</p>}
          </div>

          {/* Message Input */}
          <div className="flex flex-col gap-2">
            <label className="text-base">Your Message: </label>
            <textarea
              className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] px-3 py-2"
              maxLength="500"
              required
              rows="4"
              onChange={(e) => setUserInput({ ...userInput, message: e.target.value })}
              onBlur={checkRequired}
              value={userInput.message}
            />
          </div>

          {/* Error Message for Required Fields */}
          {error.required && (
            <p className="text-sm text-red-400">All fields are required!</p>
          )}

          {/* Submit Button */}
          <div className="flex flex-col items-center gap-2">
            <button
              className="flex items-center gap-1 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-5 py-2.5 text-white text-xs font-medium uppercase tracking-wider transition-all duration-200"
              role="button"
              onClick={handleSendMail}
            >
              <span>Send Message</span>
              <TbMailForward className="mt-1" size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility function to validate email format
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export default ContactWithoutCaptcha;
