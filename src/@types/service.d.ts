export interface ServiceI {
  data: ServiceDataI
}

export type ServiceDataI = {
  title: string;
  description: string;
  icon: string;
  iconPackage: 'Fa' | 'Ti' | 'Tb';
}[]