'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Calendar, Heart } from 'lucide-react';

export default function ContactPage() {
    const t = useTranslations('contact');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            inquiryType: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
    };

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email',
            details: ['info@ustazahmedin.com', 'speaking@ustazahmedin.com'],
            description: 'For general inquiries and speaking requests'
        },
        {
            icon: Phone,
            title: 'Phone',
            details: ['+251 11 123 4567', '+251 91 123 4567'],
            description: 'Available during business hours'
        },
        {
            icon: MapPin,
            title: 'Location',
            details: ['Addis Ababa, Ethiopia', 'Jimma, Ethiopia'],
            description: 'Based in Ethiopia, available for travel'
        },
        {
            icon: Clock,
            title: 'Response Time',
            details: ['24-48 hours', 'Urgent: Same day'],
            description: 'We respond to all inquiries promptly'
        }
    ];

    const inquiryTypes = [
        'Speaking Request',
        'General Inquiry',
        'Media Interview',
        'Educational Collaboration',
        'Community Event',
        'Book Purchase',
        'Other'
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-700 dark:to-blue-700 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t('title')}</h1>
                    <p className="text-xl opacity-90 max-w-3xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl flex items-center space-x-2">
                                    <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    <span>Send us a Message</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">{t('name')} *</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">{t('email')} *</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="your.email@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="inquiryType">Type of Inquiry</Label>
                                        <Select onValueChange={handleSelectChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select inquiry type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {inquiryTypes.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">{t('subject')} *</Label>
                                        <Input
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Brief subject of your message"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">{t('message')} *</Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Please provide details about your inquiry..."
                                            rows={6}
                                        />
                                    </div>

                                    <Button type="submit" size="lg" className="w-full">
                                        <Send className="mr-2 h-5 w-5" />
                                        {t('send')}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        {/* Contact Details */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Get in Touch
                            </h2>
                            <div className="space-y-6">
                                {contactInfo.map((info, index) => {
                                    const IconComponent = info.icon;
                                    return (
                                        <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-start space-x-4">
                                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                        <IconComponent className="h-6 w-6 text-green-600 dark:text-green-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                            {info.title}
                                                        </h3>
                                                        <div className="space-y-1">
                                                            {info.details.map((detail, idx) => (
                                                                <p key={idx} className="text-gray-600 dark:text-gray-300">
                                                                    {detail}
                                                                </p>
                                                            ))}
                                                        </div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                                            {info.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Quick Actions
                            </h3>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                                    <CardContent className="p-6 text-center">
                                        <Calendar className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            Speaking Request
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            Invite Ustaz for lectures or events
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                                    <CardContent className="p-6 text-center">
                                        <Heart className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-3" />
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            Support Work
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            Help continue advocacy efforts
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Newsletter Signup */}
                        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        {t('newsletter')}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                        Stay updated with the latest news, publications, and events
                                    </p>
                                    <div className="flex space-x-2">
                                        <Input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="flex-1"
                                        />
                                        <Button type="submit" size="sm">
                                            Subscribe
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
