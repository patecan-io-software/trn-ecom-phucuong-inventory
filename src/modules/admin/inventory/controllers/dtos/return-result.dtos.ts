import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class PaymentReturnResultQueryDTO {
	@ApiProperty()
	@Type(() => Number)
	vnp_Amount: number

	@ApiProperty()
	vnp_BankCode: string

	@ApiProperty()
	vnp_BankTranNo: string

	@ApiProperty()
	vnp_CardType: string

	@ApiProperty()
	vnp_OrderInfo: string

	@ApiProperty()
	vnp_PayDate: string

	@ApiProperty()
	vnp_ResponseCode: string

	@ApiProperty()
	vnp_TmnCode: string

	@ApiProperty()
	vnp_TransactionNo: string

	@ApiProperty()
	vnp_TransactionStatus: string

	@ApiProperty()
	@Type(() => Number)
	vnp_TxnRef: number

	@ApiProperty()
	vnp_SecureHash: string
}
