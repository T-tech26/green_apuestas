import React from 'react'
import { Button } from './ui/button'
import { FormButtonProps } from '@/types/globals'

const FormButton = ({ loading, text }: FormButtonProps ) => {
    return (
        <Button type='submit' 
            disabled={loading}
            className='bg-light-gradient-135deg text-lg text-color-30 rounded-full'
        >
            {loading ? 'Loading' : `${text}`}
        </Button>
    )
}

export default FormButton