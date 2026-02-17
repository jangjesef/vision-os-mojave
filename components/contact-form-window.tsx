"use client"

import type React from "react"

import { useState } from "react"
import { DraggableWindow } from "./draggable-window"
import { Send, User, Mail, Phone, MessageSquare, Check } from "lucide-react"

interface ContactFormWindowProps {
  zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
  onClose: () => void
  onFocus: () => void
  onDrag: (x: number, y: number) => void
  onResize: (width: number, height: number) => void
  onMaximize: () => void
  isMaximized?: boolean
}

export function ContactFormWindow({
  zIndex,
  position,
  size,
  onClose,
  onFocus,
  onDrag,
  onResize,
  onMaximize,
  isMaximized,
}: ContactFormWindowProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    service: "photography",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    }

    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      // Reset form after submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        service: "photography",
      })
    }, 1500)
  }

  return (
    <DraggableWindow
      title="Contact Studio Vision"
      width={size.width}
      height={size.height}
      zIndex={zIndex}
      position={position}
      onClose={onClose}
      onFocus={onFocus}
      onDrag={onDrag}
      onResize={onResize}
      onMaximize={onMaximize}
      isMaximized={isMaximized}
    >
      <div className="flex flex-col h-full bg-[#2a2a2a] text-white p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Get in Touch</h2>
          <p className="text-white/70">
            Have a project in mind? Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Thank You!</h3>
            <p className="text-white/70 mb-6">
              Your message has been sent successfully. We'll get back to you shortly.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-4 w-4 text-white/50" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-[#1d1d1d] border ${
                      errors.name ? "border-red-500" : "border-[#3a3a3a]"
                    } rounded-md py-2 pl-10 pr-3 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    placeholder="Your name"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-4 w-4 text-white/50" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full bg-[#1d1d1d] border ${
                      errors.email ? "border-red-500" : "border-[#3a3a3a]"
                    } rounded-md py-2 pl-10 pr-3 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    placeholder="Your email"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Phone className="h-4 w-4 text-white/50" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-[#1d1d1d] border border-[#3a3a3a] rounded-md py-2 pl-10 pr-3 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Your phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Service</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full bg-[#1d1d1d] border border-[#3a3a3a] rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="photography">Photography</option>
                  <option value="videography">Videography</option>
                  <option value="design">Graphic Design</option>
                  <option value="web">Web Development</option>
                  <option value="marketing">Digital Marketing</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-[#1d1d1d] border border-[#3a3a3a] rounded-md py-2 px-3 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Subject of your message"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Message <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <MessageSquare className="h-4 w-4 text-white/50" />
                </div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full bg-[#1d1d1d] border ${
                    errors.message ? "border-red-500" : "border-[#3a3a3a]"
                  } rounded-md py-2 pl-10 pr-3 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="Your message"
                ></textarea>
              </div>
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-md flex items-center gap-2 ${
                  isSubmitting ? "bg-blue-500/50 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                } transition-colors`}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </DraggableWindow>
  )
}

