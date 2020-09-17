const { axios } = require("./fakeBackend/mock");

const getFeedbackByProductViewData = async (product, actualize = false) => {
    try {
        const feedBackData = await axios.get('/feedback', {params: {product: product}});

        if(!feedBackData.data.feedback.length) {
            return {message: 'Отзывов пока нет'}
        }

        const usersIds = feedBackData.data.feedback.map(el => el.userId);
        const usersData = await axios.get('/users', {params: {ids: usersIds}});

        const sortedFeedBack = feedBackData.data.feedback.sort((a,b) => a.date - b.date);
        let filtered;

        if (actualize) {
            filtered = [];
            sortedFeedBack.reverse().forEach(f => {
                const finder = filtered.find(el => el.userId === f.userId);
                if (!finder) {
                    filtered.push(f);
                }
            })
            filtered.reverse();
        }
        else {
            filtered = sortedFeedBack;
        }

        const result = filtered.map(f => {
            const user = usersData.data.users.find(u => u.id === f.userId);
            const date = new Date(f.date);
            const year = date.getFullYear();
            const month = date.getMonth()+1;
            const day = date.getDate();

            return {
                user: `${user.name} (${user.email})`,
                message: f.message,
                date: `${year}-${month}-${day}`
            };
        })
        return {feedback: result};
    }
    catch (e) {
        console.log('падение');
        return {message: 'Такого продукта не существует'};
    }
};

module.exports = { getFeedbackByProductViewData };
