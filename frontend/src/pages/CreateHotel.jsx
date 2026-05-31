import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Step0PropertyType from "../components/host/AddHotelSteps/Step0PropertyType";
import Step1Info from "../components/host/AddHotelSteps/Step1Info";
// import Step2Amenities from "../components/host/AddHotelSteps/Step2Amenities";
// import Step3Policies from "../components/host/AddHotelSteps/Step3Policies";
// import Step4Photos from "../components/host/AddHotelSteps/Step4Photos";
import api from "@/lib/axios";
import { toast } from "sonner";

const CreateHotel = () => {
  const [step, setStep] = useState(0);
  const totalSteps = 4;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "", type: "Hotel", city: "", address: "", price: "",
    description: "", amenities: [],
    facilities: { hasBreakfast: false, parking: "None" },
    policies: { allowChildren: true, allowPets: false },
    photo: []
  });

  const handleUpdate = (newData) => setFormData(prev => ({ ...prev, ...newData }));

  const next = () => setStep(prev => prev + 1);
  const back = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Gọi API POST /hotels mà bạn đã viết ở Backend
      await api.post("/hotels", formData);
      toast.success("🎉 Property published successfully!");
      // Chuyển hướng về trang quản lý của Host
    } catch (err) {
      toast.error("Failed to publish property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-10">
      <div className="w-full max-w-2xl bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100">
        
        {/* Progress bar & Step dots bạn giữ nguyên style cũ */}
        
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {step === 0 && <Step0PropertyType next={next} update={handleUpdate} />}
            {step === 1 && <Step1Info data={formData} update={handleUpdate} next={next} back={back} />}
            {step === 2 && <Step2Amenities data={formData} update={handleUpdate} next={next} back={back} />}
            {step === 3 && <Step3Policies data={formData} update={handleUpdate} next={next} back={back} />}
            {step === 4 && <Step4Photos data={formData} update={handleUpdate} back={back} submit={handleSubmit} loading={loading} />}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
};

export default CreateHotel;