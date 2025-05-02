const getAllProducts = async (req, res) => {
    const { category } = req.query;
    let filter = {};
    if (category) {
      filter.category = category.toLowerCase();
    }
    const products = await Product.find(filter);
    res.json(products);
  };
  