import { Body, Controller, Inject, Logger, Post } from '@nestjs/common'
import { AuthModuleConfig, SupabaseRecordInsertWebHook } from './interfaces'
import { SupabaseClient, createClient } from '@supabase/supabase-js'
import { ApiTags } from '@nestjs/swagger'
import { AUTH_MODULE_CONFIG, USER_ROLES } from './constants'
import { SuccessResponseDTO } from '@libs'
import { AdminAuth } from './decorators'

@Controller('/v1/admin/auth/webhook')
@AdminAuth('apiKey')
@ApiTags('Webhook')
export class WebHookAuthController {
	private readonly logger = new Logger(WebHookAuthController.name)
	private readonly supabase: SupabaseClient

	constructor(
		@Inject(AUTH_MODULE_CONFIG)
		authConfig: AuthModuleConfig,
	) {
		const { supabaseConfig } = authConfig
		this.supabase = createClient(
			supabaseConfig.url,
			supabaseConfig.serviceRoleKey,
		)
	}

	@Post('onUserAdded')
	async onUserUpdated(@Body() body: SupabaseRecordInsertWebHook) {
		const user = body.record
		const userRole = user.raw_user_meta_data.role
		if (userRole) {
			this.logger.log(
				`User with ID ${user.id} is already assigned with role ${userRole}`,
			)
			return new SuccessResponseDTO({
				data: null,
			})
		}
		const { data, error } = await this.supabase.auth.admin.updateUserById(
			user.id,
			{
				user_metadata: {
					...user.raw_user_meta_data,
					role: USER_ROLES.ADMIN,
				},
			},
		)

		if (error) {
			this.logger.error(error)
			throw new Error('Unknown error')
		}

		this.logger.log(
			`User with ID '${user.id}' is successfully assigned with role '${USER_ROLES.ADMIN}'`,
		)

		return new SuccessResponseDTO({
			data: data.user,
		})
	}
}
