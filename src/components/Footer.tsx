import { FooterApiLinks, menuLinks } from '@/constants'
import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {

    const currentYear = new Date().getFullYear();

    return (
        <footer
            className='bg-color-10 flex flex-col'
        >
            <div className='py-3 px-[29px] xl:px-[160px]'>
                                    
                <Image
                    src='/logo-dark.png'
                    width={100}
                    height={100}
                    alt='light version logo'
                />

            </div>

            <div className="bg-dark-gradient-180deg-reverse flex flex-wrap py-10 px-[29px] xl:px-[160px] justify-evenly gap-10 lg:gap-32">

                <div className='flex-1'>
                    <h2 className='text-color-10 text-nowrap text-lg font-medium mb-2'>
                        Get in touch with us
                    </h2>

                    <h3 className='text-color-30 text-nowrap text-base font-medium'>Email us</h3>
                    <Link 
                        href='https://mail.google.com/mail/?view=cm&fs=1&to=teamgreenapuestas@gmail.com' 
                        target='_blank'
                        className='text-color-30 text-nowrap text-sm flex gap-1 items-center mb-3 hover:text-color-10'
                    >
                        <Image 
                            src='/mail-icon.svg' 
                            width={24}
                            height={24}
                            alt='mail icon'
                        /> info@greenapuestas.com
                    </Link>

                    <h3 className='text-color-30 text-nowrap text-base font-medium'>Chat us</h3>
                    <Link 
                        href='https://wa.me/34651024934' 
                        className='text-color-30 text-nowrap text-sm flex gap-1 items-center hover:text-color-10'
                        target='_blank'
                    >
                        <Image 
                            src='/whatsapp-icon-nofill.svg' 
                            width={24}
                            height={24}
                            alt='mail icon'
                        /> +34 651 024 934
                    </Link>
                </div>

                <div className='flex-1 flex flex-col gap-1 hover:text-color-10'>
                    <h2 className='text-color-10 text-nowrap text-lg font-medium mb-2'>
                        Quick Links
                    </h2>

                    {FooterApiLinks.map((link) => {
                        return (
                            <Link href='/' key={link.label} className='text-color-30 text-nowrap text-sm hover:text-color-10'>
                                {link.label}
                            </Link>
                        )
                    })}
                </div>

                <div className='flex-1 flex flex-col gap-1 hover:text-color-10'>
                    <h2 className='text-color-10 text-lg text-nowrap font-medium mb-2'>
                        Menu Links
                    </h2>

                    {menuLinks.map((link) => {
                        return (
                            <Link href={link.route} key={link.label} className='text-color-30 text-nowrap text-sm hover:text-color-10'>
                                {link.label}
                            </Link>
                        )
                    })}

                </div>
            </div>

            <div className="py-4 px-[29px] lg:px-[160px]">
                <h3 className='text-color-30 text-sm text-center'>Copyrights © {currentYear}. All rights reserved.</h3>
            </div>
        </footer>
    )
}

export default Footer