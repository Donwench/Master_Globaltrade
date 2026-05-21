'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  Award,
} from 'lucide-react';

export default function SupplierVerificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState<Record<string, File | null>>({
    businessRegistration: null,
    taxId: null,
    exportLicense: null,
  });
  const [certifications, setCertifications] = useState<File[]>([]);

  const handleFileChange = (field: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [field]: file }));
  };

  const handleCertificationsChange = (newFiles: File[]) => {
    setCertifications(newFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Add main documents
      if (files.businessRegistration) {
        formData.append('businessRegistration', files.businessRegistration);
      }
      if (files.taxId) {
        formData.append('taxId', files.taxId);
      }
      if (files.exportLicense) {
        formData.append('exportLicense', files.exportLicense);
      }

      // Add certifications
      certifications.forEach((cert, index) => {
        formData.append(`certifications`, cert);
      });

      const response = await fetch('/api/verification', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setTimeout(() => router.push('/dashboard'), 2000);
      }
    } catch (error) {
      console.error('Error submitting verification:', error);
      alert('Failed to submit verification documents');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Verification Submitted
          </h2>
          <p className="text-slate-400">
            Your documents have been submitted for review. We'll notify you once verification is complete.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Award className="w-8 h-8 text-sky-400" />
            Supplier Verification
          </h1>
          <p className="text-slate-400 mt-2">
            Complete your supplier verification to build trust with buyers
          </p>
        </div>

        {/* Verification Steps */}
        <div className="bg-sky-600/10 border border-sky-600/20 p-6 rounded-lg">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-sky-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-white mb-2">Why Get Verified?</h3>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>✓ Get a verification badge on your profile</li>
                <li>✓ Increase buyer confidence and trust</li>
                <li>✓ Higher chances of winning RFQs</li>
                <li>✓ Access to premium features</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Registration */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-sky-400" />
              <h3 className="text-lg font-semibold text-white">
                Business Registration
              </h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Upload your business registration certificate or incorporation document
            </p>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-sky-400 transition">
              <input
                type="file"
                id="businessRegistration"
                onChange={(e) =>
                  handleFileChange('businessRegistration', e.target.files?.[0] || null)
                }
                className="hidden"
                accept=".pdf,.jpg,.png,.doc,.docx"
              />
              <label htmlFor="businessRegistration" className="cursor-pointer block">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-white font-medium">Click to upload or drag and drop</p>
                <p className="text-slate-400 text-sm mt-1">
                  {files.businessRegistration
                    ? files.businessRegistration.name
                    : 'PDF, JPG, PNG, DOC up to 10MB'}
                </p>
              </label>
            </div>
          </div>

          {/* Tax ID */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-sky-400" />
              <h3 className="text-lg font-semibold text-white">Tax ID / VAT</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Upload your tax ID or VAT registration certificate
            </p>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-sky-400 transition">
              <input
                type="file"
                id="taxId"
                onChange={(e) =>
                  handleFileChange('taxId', e.target.files?.[0] || null)
                }
                className="hidden"
                accept=".pdf,.jpg,.png,.doc,.docx"
              />
              <label htmlFor="taxId" className="cursor-pointer block">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-white font-medium">Click to upload or drag and drop</p>
                <p className="text-slate-400 text-sm mt-1">
                  {files.taxId
                    ? files.taxId.name
                    : 'PDF, JPG, PNG, DOC up to 10MB'}
                </p>
              </label>
            </div>
          </div>

          {/* Export License */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-sky-400" />
              <h3 className="text-lg font-semibold text-white">Export License</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Upload your export license if applicable to your business
            </p>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-sky-400 transition">
              <input
                type="file"
                id="exportLicense"
                onChange={(e) =>
                  handleFileChange('exportLicense', e.target.files?.[0] || null)
                }
                className="hidden"
                accept=".pdf,.jpg,.png,.doc,.docx"
              />
              <label htmlFor="exportLicense" className="cursor-pointer block">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-white font-medium">Click to upload or drag and drop</p>
                <p className="text-slate-400 text-sm mt-1">
                  {files.exportLicense
                    ? files.exportLicense.name
                    : 'PDF, JPG, PNG, DOC up to 10MB (Optional)'}
                </p>
              </label>
            </div>
          </div>

          {/* Quality Certifications */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-sky-400" />
              <h3 className="text-lg font-semibold text-white">
                Quality Certifications
              </h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Upload ISO, CE, or other quality certifications
            </p>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-sky-400 transition">
              <input
                type="file"
                id="certifications"
                onChange={(e) => handleCertificationsChange(Array.from(e.target.files || []))}
                className="hidden"
                accept=".pdf,.jpg,.png,.doc,.docx"
                multiple
              />
              <label htmlFor="certifications" className="cursor-pointer block">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-white font-medium">Click to upload or drag and drop</p>
                <p className="text-slate-400 text-sm mt-1">
                  {certifications.length > 0
                    ? `${certifications.length} file(s) selected`
                    : 'PDF, JPG, PNG, DOC up to 10MB (Multiple files allowed)'}
                </p>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !files.businessRegistration}
            className="w-full px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
          >
            {loading ? 'Submitting...' : 'Submit for Verification'}
          </button>
        </form>

        {/* Info Box */}
        <div className="bg-slate-800/30 border border-slate-700 p-6 rounded-lg">
          <p className="text-slate-400 text-sm">
            <strong>Note:</strong> Your documents will be reviewed by our compliance team within 2-3 business days. We maintain strict confidentiality of all submitted documents. Once verified, you'll receive a verification badge on your profile.
          </p>
        </div>
      </div>
    </div>
  );
}
