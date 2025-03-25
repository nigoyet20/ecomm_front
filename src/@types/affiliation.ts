import { UUID } from "crypto";

export interface AffiliationStateI {
  id: UUID | null;
  isAuthentificated: boolean,
  filesSended: boolean,
  isAdmin: boolean,
  affiliationList: AccountAffiliationI[],
  data: {
    email: string;
  },
  affiliationInput: {
    email: string;
    password: string;
    validEmail: boolean,
    validPassword: boolean;
    error: string
  },
  pending: {
    signin: boolean;
    getInfos: boolean
  },
  modal: {
    infos: boolean
  }
  accountTarget: AccountTargetAffiliationI
}


export interface AccountAffiliationI {
  id: number,
  email: string,
  password: string,
  filesSended: boolean,
  firstname?: string,
  lastname?: string,
  address?: string,
  phone?: string,
  insta?: string,
  tiktok?: string,
  facebook?: string
}

export interface AccountTargetAffiliationI {
  firstname?: string,
  lastname?: string,
  address?: string,
  phone?: string,
  insta?: string,
  tiktok?: string,
  facebook?: string,
  files: string[] | []
}

export interface AccountAffiliationPayloadCreateI {
  email: string,
  password: string,
}

export interface AccountAffiliationPayloadResponseCreateI {
  newAccount: AccountAffiliationI
}

export interface AccountAffiliationPayloadResponseDeleteI {
  accountRemoved: number
}

export interface AccountAffiliationPayloadResponsePatchI {
  updatedAccount: AccountAffiliationI
}

export interface AccountAffiliationPayloadResponseGetI {
  account: AccountTargetAffiliationI,
  files: string[]
}

export interface AffiliationResponse {
  account: {
    id: UUID,
    email: string,
  }
  filesSended: boolean,
  isAdmin: boolean,
  affiliationList: AccountAffiliationI[]
}
