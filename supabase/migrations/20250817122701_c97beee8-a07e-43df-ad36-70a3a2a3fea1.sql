-- Drop the existing broad "ALL" policy to replace with specific policies
DROP POLICY IF EXISTS "Users can manage own payment methods" ON public.payment_methods;

-- Create specific INSERT policy for payment methods
CREATE POLICY "Users can insert own payment methods" 
ON public.payment_methods 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create specific UPDATE policy for payment methods
CREATE POLICY "Users can update own payment methods" 
ON public.payment_methods 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create specific DELETE policy for payment methods
CREATE POLICY "Users can delete own payment methods" 
ON public.payment_methods 
FOR DELETE 
USING (auth.uid() = user_id);