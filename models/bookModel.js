const books = [
    {
        id: 1,
        title: 'Chị Dậu',
        cover: 'https://picsum.photos/200/300',
        basePrice: 18000,
        oldPrice: 35000
    },
    {
        id: 2,
        title: 'Harry Potter',
        cover: 'https://picsum.photos/200/300',
        basePrice: 180000,
        oldPrice: 30000
    },
    {
        id: 3,
        title: 'Tiếng Việt 1 tập 1',
        cover: 'https://picsum.photos/200/300',
        basePrice: 10000,
        oldPrice: 35000
    },
    {
        id: 4,
        title: 'Tăng Hoàng yến',
        cover: 'https://picsum.photos/200/300',
        basePrice: 10000,
        oldPrice: 34000
    },
    {
        id: 5,
        title: 'Hoàng yến',
        cover: 'https://picsum.photos/200/300',
        basePrice: 10000,
        oldPrice: 35000
    }
    ,
    {
        id: 6,
        title: 'yến',
        cover: 'https://picsum.photos/200/300',
        basePrice: 10000,
        oldPrice: 35000
    }
    ,
    {
        id: 7,
        title: 'yếnn',
        cover: 'https://picsum.photos/200/300',
        basePrice: 10000,
        oldPrice: 35000
    }
    ,
    {
        id: 8,
        title: 'Hoàng yếnn',
        cover: 'https://picsum.photos/200/300',
        basePrice: 10000,
        oldPrice: 35000
    }
    ,
    {
        id: 9,
        title: 'Hoàng yếnnn',
        cover: 'https://picsum.photos/200/300',
        basePrice: 10000,
        oldPrice: 35000
    },
    {
        id: 10,
        title: 'Hoàng ',
        cover: 'https://picsum.photos/200/300',
        basePrice: 10000,
        oldPrice: 35000
    }
]
exports.list = () => books;

exports.get = (id) => books.find(b=>b.id ===id);