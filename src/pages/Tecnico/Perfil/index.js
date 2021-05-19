import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import {  useHistory, useParams } from 'react-router'
import { InputContainer } from '~/common/components'
import { InputWrapper } from '~/common/styles'
import { Button, Dropdown, InputMask, InputText, Toast} from '~/primereact'
import { ManagementTemplate } from '~/template'
import { getInvalidClass, getPhoneObject } from '~/utils'
import { api, getToastInstance } from '~/services'
import { cpfValidation, emailValidation, lastnameValidation, nameValidation, phoneValidation, registerValidate, selectGroupValidate } from '~/config/validations'

function Perfil() {
	const { control, errors, handleSubmit, reset, setValue } = useForm()
  const [editing, setEditing] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
	const [ data, setData ] = React.useState(null)
	const history = useHistory()
	const { id } = useParams()
	
	const toastRef = React.useRef(null)
	const toast = getToastInstance(toastRef)

	const [groupOptions] = React.useState([
		{label: 'Recanto', value: 1},
		{label: 'Cargueiros', value: 2},
		{label: 'Brejão', value: 3},
		{label: 'Veredas', value: 4},
		{label: 'Itabirinhas', value: 5}
	])

	React.useEffect(() => {
		getUserData()
	}, [])
	
	async function getUserData() {
		setLoading(true)
		try {
			const { data } = await api.get(`/tecnico/data/${id}`)

			setData(data)

			Object.keys(data).forEach(key => setValue(key, data[key]))
		} catch (err) {
			console.log(err)
			history.push('/error')
		} finally {
			setLoading(false)
		}
	}

	const editarPerfil = async form => {
		console.log('do form', form) // eslint-disable-line
		setLoading(true)

		const { phone, ...restForm } = form
		const telefone = getPhoneObject(phone)
		console.log('para API', {...restForm, telefone})
		
		if (!telefone) {
			setLoading(false)
			return toast.showError('O número de telefone providenciado é inválido')
		}
	
		try {
			await api.put(`/tecnico/${data.id}`, {...restForm, telefone})

			toast.showSuccess('Dados Salvos!')

			reset()
		}catch ({ response }) {
			const hasApiResponse = response?.data?.errors
			const errors = hasApiResponse
				?Object.values(response.data.errors)
				:['Ocorreu um erro ao processar a requisição']
			toast.showInfos(errors)
		}finally {
			setLoading(false)
			setEditing(false)
			getUserData()
		}
	}

	const resetForm = () => {
		reset()

		Object.keys(data).forEach(key => setValue(key, data[key]))

		setEditing(false)
	}

	return (
		<ManagementTemplate loading={loading} title='Perfil'>
			<Toast ref={toastRef}/>
			<form onSubmit={handleSubmit(editarPerfil)}>
				<InputWrapper columns={2} gap='10px'>
					<Controller
						name='nome'
						control={control}
						rules={nameValidation}
						defaultValue={data?data.nome:''}
						render={({ name, value, onChange }) => (
						<InputContainer name={name} label='Nome' error={errors[name]}>
							<InputText
								name={name}
								value={value}
								disabled={!editing}
								className={getInvalidClass(errors[name])}
								onChange={evt => onChange(evt.target.value)}/>
						</InputContainer>
					)}/>
					<Controller
						name='sobrenome'
						control={control}
						rules={lastnameValidation}
						defaultValue={data?data.sobrenome:''}
						render={({ name, value, onChange }) => (
						<InputContainer name={name} label='Sobrenome' error={errors[name]}>
							<InputText
								name={name}
								value={value}
								disabled={!editing}
								className={getInvalidClass(errors[name])}
								onChange={evt => onChange(evt.target.value)}/>
						</InputContainer>
					)}/>
				</InputWrapper>
				<Controller
					name='email'
					control={control}
					defaultValue={data?data.email:''}
					rules={emailValidation}
					render={({ name, value, onChange }) => (
					<InputContainer name={name} label='Email' error={errors[name]}>
						<InputText
							name={name}
							value={value}
							disabled={!editing}
							className={getInvalidClass(errors[name])}
							onChange={evt => onChange(evt.target.value)}/>
					</InputContainer>
				)}/>
				<InputWrapper columns={2} gap='10px'>
					<Controller
						name='cpf'
						control={control}
						rules={cpfValidation}
						defaultValue={data?data.cpf:''}
						render={({ name, value, onChange }) => (
							<InputContainer name={name} label='CPF' error={errors[name]}>
								<InputMask
									name={name}
									value={value}
									disabled={!editing}	
									mask='999.999.999-99'
									className={getInvalidClass(errors[name])}
									onChange={evt => onChange(evt.target.value)}/>
							</InputContainer>
						)}/>
						<Controller
							name='phone'
							control={control}
							rules={phoneValidation}
							defaultValue={data?data.phone:''}
							render={({ name, value, onChange }) => (
							<InputContainer name={name} label='Telefone' error={errors[name]}>
								<InputMask
									name={name}
									value={value}
									disabled={!editing}
									mask='(99) 9 9999-9999'
									className={getInvalidClass(errors[name])}
									onChange={evt => onChange(evt.target.value)}/>
							</InputContainer>
						)}/>
				</InputWrapper>
				<InputWrapper columns={2} gap='10px'>
					<Controller
						name='numero_registro'
						control={control}
						rules={registerValidate}
						defaultValue={data?data.numero_registro:''}
						render={({ name, value, onChange }) => (
						<InputContainer name={name} label='Número do Conselho' error={errors[name]}>
							<InputText
								name={name}
								value={value}
								disabled={!editing}
								className={getInvalidClass(errors[name])}
								onChange={evt => onChange(evt.target.value)}/>
						</InputContainer>
					)}/>
					<Controller
						name='id_grupo'
						defaultValue=''
						control={control}
						rules={selectGroupValidate}
						render={({ name, value, onChange }) => (
						<InputContainer name={name} label='Grupo de Usuário' error={errors[name]}>
							<Dropdown
								name={name}
								value={value}
								disabled={!editing}
								options={groupOptions}
								className={getInvalidClass(errors[name])}
								onChange={evt => onChange(evt.target.value)}/>
						</InputContainer>
					)}/>
				</InputWrapper>
				<InputWrapper columns={editing?2:3} gap='10px'>
					{!editing && <Button type='button' label='Desativar Perfil'/>}
					{!editing && <Button type='button' label='Alterar Senha'/>}
					{!editing && <Button type='button' onClick={() => setEditing(true)} label='Editar Perfil'/>}
					{editing && <Button type='button' onClick={resetForm} label='Cancelar'/>}
					{editing && <Button label='Salvar'/>}
				</InputWrapper>
			</form>
		</ManagementTemplate>
	)
}

export default Perfil