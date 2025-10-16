import { Link } from "lucide-react"
import Image from "next/image"

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-muted flex min-h-svh flex-col justify-center gap-6 p-6 md:p-10 items-center'>
      <div className='flex w-full max-w-sm flex-col gap-6'>
        <Link href={'/'} className='flex items-center justify-center gap-2 self-center font-medium'> 
          <Image src={'/logo.svg'} width={30} height={30} alt='AI Automation' />
        </Link>
        {children}
      </div>
    </div>
  )
}