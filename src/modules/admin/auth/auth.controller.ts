import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@Controller('/api/v1/admin/auth/webhook')
@ApiTags('Webhook')
export class WebHookAuthController {
	@Post('onUserAdded')
	onUserUpdated(@Body() body: any) {
		console.log(body)
	}
}
