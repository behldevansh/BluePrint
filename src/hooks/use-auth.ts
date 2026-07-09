import {useAuthActions} from "@convex-dev/auth/react";
import { Sign } from "crypto";
import { Resolver } from "dns";
import {useRouter} from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { set } from "date-fns";

const signInSchema=z.object({
  email:z.string().email('Invalid email address'),
  password:z.string().min(6, 'Password must be at least 6 characters long'),
});

const signUpSchema=z.object({
    firstName:z.string().min(1, 'First name is required'),
    lastName:z.string().min(1, 'Last name is required'),
    email:z.string().email('Invalid email address'),
    password:z.string().min(6, 'Password must be at least 6 characters long'),
});

type SignInData=z.infer<typeof signInSchema>;
type SignUpData=z.infer<typeof signUpSchema>;

export const useAuth=() => {
  const {signIn, signOut} = useAuthActions();
  const router= useRouter();
  const [isloading, setIsLoading] = useState(false);

  const signInForm=useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
        email:'',
        password:'',
    },
  })
  const signUpForm=useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
        firstName:'',
        lastName:'',
        email:'',
        password:'',
    },
  })

  const handleSignIn=async(data:SignInData) => {
    setIsLoading(true)
    try{
        await signIn('password',{
            email:data.email,
            password:data.password,
            flow:'signIn',
        })
        router.push('/dashboard')
    } catch(error){
        console.error(error)
        signInForm.setError('password', {
            // type:'manual',
            message:'Invalid email or password',
        })
        
    }
    finally{
            setIsLoading(false)
        }
}

const handleSignUp=async(data:SignUpData) => {
    setIsLoading(true)
    try{
        await signIn('password',{
            email:data.email,
            password:data.password,
            name:`${data.firstName} ${data.lastName}`,
            flow:'signUp',
    })
    router.push('/dashboard')
} 
    catch (error){
        console.error(error)
        signUpForm.setError('root', {
            // type:'manual',
            message:'Failed to create account. Please try again.',
        })
    }
    finally{
    setIsLoading(false)
    } 
}
const handleSignOut=async() => {
    // setIsLoading(true)
    // await signOut()
    // setIsLoading(false)
    try{
        await signOut()
        router.push('/auth/sign-in')
    }catch(error){
        console.error('Sign out error:',error)
    }

}
return {
    signInForm,
    signUpForm,
    handleSignIn,
    handleSignUp,
    handleSignOut,
    isloading,
}
}