import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata = {
  title: 'スピーディー気まずさ解消！ - 会話スターター生成アプリ',
  description: 'AI を使って会議前、エレベーター、休憩室などの気まずい状況で使える会話のきっかけを生成します。',
  keywords: ['会話', 'スターター', 'AI', 'コミュニケーション', '会話のきっかけ'],
  authors: [{ name: 'InteractiveConversationStarter' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className={inter.variable}>
      <head>
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}