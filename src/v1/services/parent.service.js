class ParentService {
    constructor(model) {
        this.model = model;
    }

    getAll = async ({ limit = 5, page = 1, selectField = "" }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const skip = (page - 1) * limit;
                const _model = this.model;

                if (limit === 0 && page === 0) {
                    return resolve({
                        elements: await _model.find(),
                        errors: null,
                        status: 200,
                    })
                }

                await _model
                    .find({ is_delete: false })
                    .select(selectField)
                    .limit(limit)
                    .skip(skip)
                    .exec((error, response) => {
                        if (error) {
                            reject(error);
                        }

                        _model.count().exec((error, count) => {
                            if (error) {
                                reject(error);
                            }

                            resolve({
                                elements: response,
                                errors: null,
                                status: 200,
                                meta: {
                                    pagination: {
                                        page,
                                        limit,
                                        totalRows: Math.ceil(count / limit),
                                    }
                                }
                            })
                        })
                    })
            } catch (error) {
                return reject(error);
            }
        })

    };

    create = async (data) => {
        const response = await this.model.create(data);

        return {
            elements: response,
            status: 201,
            errors: null,
        }
    };

    update = async ({ id, data }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.model.findOneAndUpdate({ _id: id }, data, {
                    upsert: false,
                    new: true
                });

                resolve({
                    elements: response,
                    status: 201,
                    errors: null,
                });

            } catch (error) {
                reject(error)
            }
        })
    };

    delete = ({ id, isDelete = false }) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (isDelete) {
                    const response = await this.model.findOneAndDelete({ _id: id }, { rawResult: true });
                    return resolve({
                        errors: null,
                        status: 200,
                        elements: response,
                    })
                }

                const response = await this.update({ id, data: { is_delete: true } });

                resolve(response);

            } catch (error) {
                reject(error);
            }
        })
    };

    deleteForce = async (id) => {
        return await this.delete({ id, isDelete: true });
    }

    getById = (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                    return resolve({
                        errors: {
                            message: "Id không đúng giá trị"
                        },
                        elements: null,
                        status: 400,
                    })
                }
                const response = await this.model.findById(id).exec();

                if (!response) {
                    return resolve({
                        errors: {
                            message: "Id khÔng tồn tại",
                        },
                        elements: null,
                        status: 200,
                    })
                }

                resolve({
                    elements: response,
                    errors: null,
                    status: 200,
                });
            } catch (error) {
                reject(error)
            }
        })
    };
}

module.exports = ParentService;