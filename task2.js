const TRANSACTION_TYPES = {
    REPLENISHMENT : 'replenishment',
    PAYMENT : 'payment',
    WITHDRAWAL : 'withdrawal'
}

const task21 = (arr) =>{

    const result = arr.reduce((result, transaction) => {
        const found = result.find(el => el.year === transaction.year && el.month === transaction.month);
        found ? found.opsCount++ : result.push({year: transaction.year, month: transaction.month, opsCount: 1});
        
        return result
    }, [])
    return result.sort((a,b) => b.opsCount - a.opsCount).slice(0,3)
}

/*
    Получаем последний день месяца
*/
const getDate = (year,month,data) =>{

    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const resultDate = `${year}-${month.toString().padStart(2, '0')}-${lastDayOfMonth.toString().padStart(2, '0')}`;

    data.date = resultDate;
    
    return data
}

/*
    На вход поступает массив объектов
    На выходе получаем объект - статистику
*/
const calculateStats = (foundMonths) =>{

    let totalReplenishment = 0;

    const result = foundMonths.reduce((result, transaction) => {
        if(transaction.type === TRANSACTION_TYPES.REPLENISHMENT){
            result.monthBalance += transaction.amount;
            totalReplenishment += transaction.amount;
        }else if(transaction.type === TRANSACTION_TYPES.PAYMENT){
            result.monthBalance -= transaction.amount;
        }else if(transaction.type === TRANSACTION_TYPES.WITHDRAWAL){
            result.monthBalance -= transaction.amount;
            result.monthWithdrawal += transaction.amount;
        }

        return result
    }, {date: '', monthBalance: 0, monthWithdrawal: 0, withdrawalRate: 0, rank: 'Бронзовый'})

    result.withdrawalRate = result.monthWithdrawal/totalReplenishment;
    result.rank = result.withdrawalRate < 0.15
                ? 'Золотой'
                : (result.withdrawalRate < 0.3 ? 'Серебряный' : 'Бронзовый');

    return result
}

/*
    Разделяем транзакции по годам и месяцам.
    Каждая ячейка массива будет хранить список транзакций за определенный месяц года.
*/
const splitTransactions = (arr) => {

    const splitedTransactions = [];

    arr.map((el) => {
        const findCurrentMonthYear = splitedTransactions.find(group => el.month === group.month && el.year === group.year);
        
        if(!findCurrentMonthYear){
            const filteredTransactions = arr.filter(transaction => el.month === transaction.month && el.year === transaction.year);

            splitedTransactions.push({
                year: el.year,
                month: el.month,
                transactions: filteredTransactions
            })
        }
    })

    return splitedTransactions;
}

const task22 = (year, month, arr) => {

    const foundMonths = arr.filter(el => el.year === year && el.month === month);

    const calculatedStats = calculateStats(foundMonths);

    return getDate(year,month,calculatedStats)
}

const task23 = (arr) => {

    const splitedTransactions = splitTransactions(arr);

    let prevBalance = 0;

    const result = splitedTransactions.map((el) => {

        const calculatedTransactions = calculateStats(el.transactions);

        const result = {
            ...calculatedTransactions,
            totalBalance: calculatedTransactions.monthBalance + prevBalance
        }

        prevBalance += result.monthBalance;

        return getDate(el.year, el.month, result)
    })

    return result;
}