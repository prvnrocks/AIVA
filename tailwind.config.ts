const config = {
    content: [
        "./app/**/*.{ts,tsx}",
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./node_modules/@shadcn/ui/**/*.{ts,tsx}", // 👈 include this if needed
    ],
    plugins: {
        "@tailwindcss/postcss": {},
    },
};

export default config;