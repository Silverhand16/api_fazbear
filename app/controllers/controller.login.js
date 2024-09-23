
const db = require('../config/db.config.js');
const Usuario = db.Login;

/*exports.getEmployeeById = (req, res) =>{
    let employeeId = req.params.id;
    Employee.findByPk(employeeId)
        .then(employee =>{
            res.status(200).json({
                message: 'Empleado encontrado con id='+employeeId,
                employee: employee
            });
    })
    . catch(error => {
        console.log(error);
        res.status(500).json({
            message: 'Error al buscar empleado',
            error: error
        });
    });
}*/

/*exports.getUsuario = (req, res) =>{
    let UserCorreo = req.params.correo;
    let UserContrasenia = req.params.contrasenia;
    Login.findByCorreo(UserCorreo)
}*/

exports.getUsuario = async (req, res) => {
    const { correo, contrasenia } = req.body;
    const user = await Login.findOne({ where: { correo } });
    if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const isPasswordValid = await bcrypt.compare(contrasenia, user.contrasenia);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    const token = jwt.sign({ id: user.id }, 'Bienvenido', { expiresIn: '1h' });
    res.json({ token });
};