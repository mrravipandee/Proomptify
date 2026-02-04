export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#050520] text-white flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
            <p className="text-lg mb-4 text-center max-w-2xl">
                Have questions or need assistance? We&apos;re here to help! Reach out to our support team and we&apos;ll get back to you as soon as possible.
            </p>
            <a 
                href="mailto:thecreaters70@gmail.com"
                className="mt-4 text-blue-400 underline"
            >
                Email Support
            </a>
        </div>
    )
}