import { Sequelize } from 'sequelize'

const sequelize = new Sequelize('nomedobanco', 'usuario', 'senha', {
  host: 'localhost',
  dialect: 'mysql'
})

try {
  sequelize.authenticate()
  console.log('Conectamos com sucesso com o Sequelize!')
} catch (err) {
  console.log('Não foi possível conectar: ', err)
}

export default sequelize