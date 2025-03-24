
export interface AffiliationStateI {
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
  },
  pending: {
    signin: boolean;
  }
}


export interface AccountAffiliationI {
  id: number,
  email: string,
  password: string,
  filesSended: boolean
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

export interface AffiliationResponse {
  account: {
    email: string,
    firstname: string,
    lastname: string
  }
  filesSended: boolean,
  isAdmin: boolean,
  affiliationList: AccountAffiliationI[]
}
