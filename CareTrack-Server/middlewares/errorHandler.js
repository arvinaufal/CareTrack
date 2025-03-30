const errorHandler = {
    handler: (error, request, response, next) => {
        let statusCode, message;
        console.log(error, 'in error handler middleware');

        if (!error.origin) {
            switch (error.name) {
                case 'SequelizeValidationError':
                case 'SequelizeUniqueConstraintError':
                    statusCode = 400;
                    message = error.errors.map(er => { return er.message });
                    break;
    
                case 'JsonWebTokenError':
                    statusCode = 401;
                    message = `Unauthenticated`;
                    break;
    
                default:
                    statusCode = 500;
                    message = `Internal Server Error`;
                    break;
            }

            response.status(statusCode).json({ code: statusCode, status: 'failed', message });
        }

        if (error.origin === 'UserController') {
            switch (error.name) {
                case 'DuplicateEmail':
                    statusCode = 400;
                    message = `Email already exists!`;
                    break ;
    
                case 'DuplicateUsername':
                    statusCode = 400;
                    message = `Username already exists!`;
                    break ;
    
                case 'EmptyUsernameEmail':
                    statusCode = 400;
                    message = `Username/Email is required`;
                    break;
    
                case 'EmptyName':
                    statusCode = 400;
                    message = `Name is required`;
                    break;
    
                case 'EmptyUsername':
                    statusCode = 400;
                    message = `Username is required`;
                    break;
    
                case 'EmptyEmail':
                    statusCode = 400;
                    message = `Email is required`;
                    break;
    
                case 'InvalidEmail':
                    statusCode = 400;
                    message = `Email is not valid`;
                    break;
    
                case 'EmptyPassword':
                    statusCode = 400;
                    message = `Password is required`;
                    break;

                case 'googleAcc':
                    statusCode = 400;
                    message = `Use your Google account to login`;
                    break;
    
                case 'NotMatched':
                    statusCode = 401;
                    message = `Invalid Email/Password!`;
                    break;
    
                case 'Unauthenticated':
                    statusCode = 401;
                    message = `Unauthenticated`;
                    break;
    
                case 'NotVerified':
                    statusCode = 401;
                    message = `Your account hasn't been verified yet. Please check your email to verify your account!`;
                    break;
    
                default:
                    statusCode = 500;
                    message = `Internal Server Error`;
                    break;
            }

            response.status(statusCode).json({ code: statusCode, status: 'failed', message });
        }


        
        if (error.origin === 'MedicineController') {
            switch (error.name) {
                case 'EmptyCode':
                    statusCode = 400;
                    message = `Code is required`;
                    break ;

                case 'EmptyName':
                    statusCode = 400;
                    message = `Name is required`;
                    break ;
                    
                case 'EmptyPrice':
                    statusCode = 400;
                    message = `Price is required`;
                    break ;
                
                case 'DuplicateCode':
                    statusCode = 400;
                    message = `Medicine code already exists!`;
                    break ;

                case 'MedicineNotExists':
                    statusCode = 404;
                    message = `Medicine is not exists!`;
                    break ;
    
                default:
                    statusCode = 500;
                    message = `Internal Server Error`;
                    break;
            }

            response.status(statusCode).json({ code: statusCode, status: 'failed', message });
        }

        if (error.origin === 'TreatmentController') {
            switch (error.name) {
                case 'EmptyCode':
                    statusCode = 400;
                    message = `Code is required`;
                    break ;

                case 'EmptyName':
                    statusCode = 400;
                    message = `Name is required`;
                    break ;
                    
                case 'EmptyCost':
                    statusCode = 400;
                    message = `Cost is required`;
                    break ;
                
                case 'DuplicateCode':
                    statusCode = 400;
                    message = `Treatment code already exists!`;
                    break ;

                case 'TreatmentNotExists':
                    statusCode = 404;
                    message = `Treatment is not exists!`;
                    break ;
    
                default:
                    statusCode = 500;
                    message = `Internal Server Error`;
                    break;
            }

            response.status(statusCode).json({ code: statusCode, status: 'failed', message });
        }

        if (error.origin === 'PatientController') {
            switch (error.name) {
                case 'EmptyCodeId':
                    statusCode = 400;
                    message = `Patient Code/Patient ID is required`;
                    break ;

                case 'EmptyName':
                    statusCode = 400;
                    message = `Name is required`;
                    break ;
                    
                case 'EmptyEmail':
                    statusCode = 400;
                    message = `Patient email is required`;
                    break ;

                case 'EmptyBirthdate':
                    statusCode = 400;
                    message = `Birthdate is required`;
                    break ;
                
                case 'DuplicateCodeId':
                    statusCode = 400;
                    message = `Patient Code/Patient ID already exists!`;
                    break ;

                case 'PatientNotExists':
                    statusCode = 404;
                    message = `Patient is not exists!`;
                    break ;
                
                case 'InvalidEmail':
                    statusCode = 400;
                    message = `Email is not valid`;
                    break;
    
                default:
                    statusCode = 500;
                    message = `Internal Server Error`;
                    break;
            }

            response.status(statusCode).json({ code: statusCode, status: 'failed', message });
        }

        if (error.origin === 'MedicalRecordController') {
            switch (error.name) {
                case 'EmptyDate':
                    statusCode = 400;
                    message = `Medical Record Date is required!`;
                    break ;

                case 'InvalidTotalPrice':
                    statusCode = 400;
                    message = `More than Rp. 1 is required!`;
                    break ;
                    
                case 'EmptyTreatments':
                    statusCode = 400;
                    message = `Minimum 1 treatment is required!`;
                    break ;

                case 'EmptyMedicines':
                    statusCode = 400;
                    message = `Minimum 1 medicine is required!`;
                    break ;
                
                case 'EmptyPatientName':
                    statusCode = 400;
                    message = `Patient name is required!`;
                    break ;

                case 'PatientNameTooLong':
                    statusCode = 400;
                    message = `Max 200 characters for Patient Name!`;
                    break ;

                case 'EmailTooLong':
                    statusCode = 400;
                    message = `Max 200 characters for Patient Email!`;
                    break ;

                case 'EmptyBirthDate':
                    statusCode = 400;
                    message = `Patient birthdate is required!`;
                    break ;

                case 'InvalidEmail':
                    statusCode = 400;
                    message = `Invalid patient email!`;
                    break ;

                case 'EmptyPatientCode':
                    statusCode = 400;
                    message = `Patient Code/Patient ID is required!`;
                    break ;

                case 'PatientCodeTooLong':
                    statusCode = 400;
                    message = `Max 8 characters for Patient Code/Patient ID!`;
                    break ;

                case 'PatientNotExists':
                    statusCode = 404;
                    message = `Patient is not exists!`;
                    break ;
                
                case 'EmptyPatientId':
                    statusCode = 400;
                    message = `Patient is required`;
                    break;

                case 'Duplicate Patient':
                    statusCode = 400;
                    message = `Patient already exists!`;
                    break;
    
                default:
                    statusCode = 500;
                    message = `Internal Server Error`;
                    break;
            }

            response.status(statusCode).json({ code: statusCode, status: 'failed', message });
        }

    

        response.status(statusCode).json({ code: statusCode, status: 'failed', message });
    }

}

module.exports = errorHandler;