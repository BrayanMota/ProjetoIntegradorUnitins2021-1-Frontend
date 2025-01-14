import React from 'react'
import { Link, useHistory } from 'react-router-dom'

import { Button, Column, DataTable, InputText } from '~/primereact'
import { api } from '~/services'
import { ManagementTemplate} from '~/pages/templates'
import { getStringNormalized } from '~/utils'

function Busca() {
	const [filteredCooperados, setFilteredCooperados] = React.useState([])
	const [cooperados, setCooperados] = React.useState([])
	const [loading, setLoading] = React.useState(false)
	const [query, setQuery] = React.useState('')
	const history = useHistory()

	React.useEffect(() => {
		(async () => {
			setLoading(true)
			try {
				const { data } = await api.get('/cooperado/index')
				setCooperados(data)
				setFilteredCooperados(data)
			} catch (err) {}
			finally {
				setLoading(false)
			}
		})()
	}, [])

	React.useEffect(() => {
		const queryNormalized = getStringNormalized(query.toLowerCase())
		const filteredCooperados = cooperados.filter(t => {
			const normalizedName = getStringNormalized(t.nome_cooperado.toLowerCase())
			const normalizedCPF = getStringNormalized(t.cpf_cooperado)

			if (normalizedName.includes(queryNormalized))
				return true
			else if (normalizedCPF.startsWith(queryNormalized))
				return true

			return false
		})

		setFilteredCooperados(filteredCooperados)
	}, [query])

	return (
		<ManagementTemplate title='Buscar Cooperado' loading={loading}>		
			<InputText
				value={query}
				className='p-mb-3'
				placeholder='Pesquisar por nome ou cpf'
				onChange={e => setQuery(e.target.value)}
			/>
			<DataTable emptyMessage='Nenhum item encontrado' value={filteredCooperados} className="p-datatable-striped">
				<Column field="nome_cooperado" header="Nome"/>
				<Column field="cpf_cooperado" header="CPF"/>
				<Column bodyClassName='p-d-flex p-jc-around' headerClassName='p-d-flex p-jc-center' header='Ações' body={rowData => (
					<Link to={`/cooperados/${rowData.id}`}>Detalhes</Link>
				)}/>
			</DataTable>
			<Button onClick={() => history.push('/cadastrar/cooperado')} className='p-mt-3' label='Novo'/>
		</ManagementTemplate>
	)
}

export default Busca