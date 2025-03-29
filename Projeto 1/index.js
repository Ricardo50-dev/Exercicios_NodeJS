import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs';

operation()

function operation() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que você deseja fazer?',
            choices: ['Criar Conta', 'Consultar Saldo', 'Depositar', 'Sacar', 'Sair'],
        },
    ]).then((answer) => {
        const action = answer['action']
        
        if(action === 'Criar Conta'){
            createAccount()
        }else if(action === 'Consultar Saldo'){
            getAccountBalance()
        }else if(action === 'Depositar'){
            deposit()
        }else if(action === 'Sacar'){
            withdraw()
        }else{
            console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
            process.exit()
        }

    }).catch((err) => console.log(err))
}

function createAccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir'))

    buildAccount()
}

function buildAccount() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para a sua conta:',
        },
    ]).then((answer) => {
        const accName = answer['accountName']
        console.info(accName)

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accName}.json`)){
            console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome!'))
            buildAccount()
            return
        }

        fs.writeFileSync(`accounts/${accName}.json`, '{"balance": 0}', function (err) {console.log(err)},)

        console.log(chalk.green('Parabéns, a sua conta foi criada!'))
        operation()

    }).catch((err) => console.log(err))
}

function deposit() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?',
        },
    ]).then((answer) => {
        const accName = answer['accountName']
        if(!checkAccount(accName)){
            return deposit()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja depositar',
            },
        ]).then((answer) => {
            const amount = answer['amount']

            addAmount(accName, amount)
            operation()
        }).catch((err) => console.log(err))

    }).catch((err) => console.log(err))
}

function checkAccount(accName) {
    if (!fs.existsSync(`accounts/${accName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe, escolha outro nome!'))
        return false
    }
    return true
}

function addAmount(accountName, amount) {
    const accountData = getAccount(accountName)
    if(!amount){
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return deposit()
    }
    
    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        },
    )

    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`))
}

function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r'
    })

    return JSON.parse(accountJSON)
}

function getAccountBalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?',
        },
    ]).then((answer) => {
        const accName = answer['accountName']

        if(!checkAccount(accName)) {
            return getAccountBalance()
        }

        const accData = getAccount(accName)

        console.log(chalk.bgBlue.black(`Olá, o saldo da sua conta é de R$${accData.balance}`))

        operation()
    }).catch((err) => console.log(err))


}

function withdraw() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?',
        },
    ]).then((answer) => {
        const accName = answer['accountName']

        if(!checkAccount(accName)) {
            return withdraw()
        }
        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja sacar?',
            },
        ]).then((answer) => {
            const amount = answer['amount']

            removeAmount(accName, amount)
        }).catch((err) => console.log(err))
    }).catch((err) => console.log(err))
}

function removeAmount(accountName, amount) {
    const accData = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return withdraw()
    }
    if (accData.balance < amount) {
        console.log(chalk.bgRed.black('Valor indisponível!'))
        return withdraw()
    }

    accData.balance = parseFloat(accData.balance) - parseFloat(amount)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accData),
        function (err) {
            console.log(err)
        },
    )

    console.log(chalk.green(`Foi realiazado um saque de R$${amount} da sua conta!`))

    operation()
}