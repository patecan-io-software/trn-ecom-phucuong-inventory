export interface PaymentServiceConfig {
	apiUrl: string
	paymentReturnUrl: string
	merchantCode: string
	apiVersion: string
	durationInSecond: number
	hashSecret: string
	paymentResultRedirectUrl: string
}

export interface PaymentModuleConfig {
	serviceConfig: PaymentServiceConfig
}
