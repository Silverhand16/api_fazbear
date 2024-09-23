module.exports = (sequelize, Sequelize) => {
	const Login = sequelize.define('login', {	
	  correo: {
	    type: Sequelize.STRING,
            field: 'CORREO'
	           },
	  contrasenia: {
	    type: Sequelize.STRING,
            field: 'CONTRASENIA'
              }
	}, {
        tableName: 'USUARIO', 
        timestamps: false      
    });
	
	return Login;
}