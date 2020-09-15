const { axios } = require("./fakeBackend/mock");

const getFeedbackByProductViewData = async (product, actualize = false) => {
    try {
        const feedBackData = await axios.get('/feedback', {params: {product: product}});
        const usersIds = feedBackData.data.feedback.map(el => el.userId);
        const usersData = await axios.get('/users', {params: {ids: usersIds}});
        const result = feedBackData.data.feedback.map(f => {
            const user = usersData.data.users.find(u => u.id === f.userId);

            const res = {
                user: user.name + ' (' + user.email + ')',
                message: f.message,
                date: f.date
            }
            console.log('res', res)

            return res
        })
        return {feedback: result};
    }
    catch (e) {
        console.log('падение');
    }
};

getFeedbackByProductViewData('extern');

module.exports = { getFeedbackByProductViewData };
