import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 这里替换成你的 base64 图标数据
const faviconBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAC/VBMVEUAAADcxWTu2GTexVr17HL043Dw4Wrmzl3iz2S6nEmvk0ZwUjJXQiyObkGaiE6ij1akiUmHYzRyTSVTOSSVhVR7XUBmRShiPh6XfEbt5Yb175eYczbHrVNKLiCxjDdbOhVaSkcjGSO6m1O+sG80HSxjUD9CIBEwGg3Uy5RPMRNoVlVqb4tdb5xIWY2eej399YthaYRTaZ9YaZRvhqXIokmpmlFtdaFPZJVcdKhagcdPSlN6PAv07YPIsmJOd8Bpg7pleqqWf1JMJhVsYm9YdrtYebJhicNYMxuBhoRmjN53ksJjd7VjTzFOXX+Egm0+aLZBOjKmeSq3kDRXg9NEYqV2iY+FhpGEWy/p1ml9UykoPFfu5JdZY3FySRKMYiSmfDWwhC7XtEyak2vVrzxcYmI6LyllTCF4XS3QuFeObDE9RmN4X0x5kaZ2gXnl3oZvbns5PlQ+LA+Qh3tGetkjq/tW4f9Ox/5cz/1GofRbT2bfzXQ+WJN7VxVrc5mdjn8ma+884v6O+f+s8v9/6/8snfl0t9Q5ITr+9p0yV6F9WyGDd2AsZuZ69v9Xt+11jISDnnV4pbRw5P6X/v9AhfcrJytJb8hg+v8rluR5a1hu9v9ikNIvSYZsRBm/wXHrxEJvUiFnyP1L+f8vZ8MljesydsNZ9v9bkeLx5Xqvu4qVhGpDre49QLdH4v5eWHl+bWVCkOR6eYMyJiHMu3Pr13eKQhSJUxl+lrMmvPtN8v94Z3NFxfqAennGoDyhhC+DNRSXgi6KbVJ3pdNQpuwpWcmUaSNrQA8yQGtLQkOAbzdCS3eubR2Ck59woMhC8v9tZZPOmDJLRGGIdTl2k9J0ibccO0urZRKGby2ZcEGBW2dES6g3dNE0WXsvSqQhk/RI1f5QbLSVWBhUVURugq83OkFgTFdDesRI0fN+mdu9nHFbPlZpVG1jPDdDV2LGfBYWPF2SrekgMzSHoOZESleDZBeduPWTcRezoSyXuOlDcKBud4JVJAqhm0B5ekmOh0eXiDxkWus4AAAAAXRSTlMAQObYZgAAA51JREFUeAFV0AN4LGcUBuDv7MysrYmTurFtW9c2atu2bdu2FdeKba6S1c12Ud330c8jghcRQIAHAHkEBCIXwLqFdvjPJasM+c7/dggAC4BcQqIJsAglpwi0ahUoMK8nHwRMeneYYGFziRfcpAwmIgXN8OSL7yMUiebEAGmFq4ggk0dDIK+fE4kIDjHsViHntoS2kNbFhfVlEVmUTpFp6vgfIj16Ihs4sojNwfT5igBKjBhIKhVLpZZgdOSGzUhHJR6DRgO70NZdt0GAAg/FixUtYb/qehSF9SoqfatbdfRbSqUcPq+ybJ+7qZskTbQsYKXjX6CMjbL2WPa8dIzebbdDC0HyqPI1g22M67O8nP5K5NFVNlF11lRhJxQ2O6zHvQAW9gbN13IIE9tL23dSGXk5179gP4G+tQrRDbA/aiMI1sbl57a+fgL5YDWHNimopeoZABUvs1hQvO+h37qbPOcExuQjY89rMDV+4sRHDBm5uoQfjrnPsv7lsqgoohf/MG7Uz/CDLw+kSNQNN6W9To/cFdFM5yhOMp5dVkP05C46Jyk+idreLfvuwu3PvCB6mSpbal4WStmzjDNRP0ToiUDUliAl2nSM7XZqedgsADfz5iu4tnXGeHrB8KIc8itkpW7IRt++nblR9orARTx/ZNR84ZfMzv6ujfROkk46axzR9TM3luymyo/orheJN39+6TWP7OKKPv5maKOMLp88Y6D+xU0bi066/6TzTAspRLylhWjfo5TWlef5joheqsbb3120Pe9MzcoFUyFfugTACqDbe/6XOQjmuOdbqmc1O3+ow/X8dnrAGdLuFMADqG6k+3ce0nwkkSD4i9v2XyTYUtb3kUhVg5UMEgASA1S2T6IlFezbzEkxO37crLjh/V+r73XskPORYrBueO34fPSYrjrugks+vQ83tmbfJFcEW15fGxx6rxMsC27vA6Zda9+szb7g26Fi4I0k6XFRQ+LstUK7ETI3eMnviyNF9fHlWZkPL33L85HR0SclZ2ZefFJ9xiUJG40MKpnPTTVFflnfRUa/qfvGPFhUFBeXdaklIUGrCEN0/t7brCNxcUXe0/jR7XWPqS/OKioqLDzdpk7Q6tIkgCJvef1iwEqB/Js0u2ny50LH77vUGqMu4QSwmK+sOE6eA7/usod72aB5/rLN74s2v6UTLrwHL6chn2GIoRPoBGa1Lv0Er/x0tTTshDR1KEDwKuHgAofD/Q6MAvgLtR1R/oin/AMAAAAASUVORK5CYII='

export const metadata: Metadata = {
  title: "炉石小工具",
  description: '记录你的炉石传说对战数据',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: [
      {
        url: faviconBase64,
        sizes: '16x16',
        type: 'image/x-icon',
      },
      {
        url: faviconBase64,
        sizes: '32x32',
        type: 'image/x-icon',
      }
    ],
    shortcut: faviconBase64,
    apple: faviconBase64,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={faviconBase64} type="image/x-icon" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
