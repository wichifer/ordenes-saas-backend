import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';


const prisma = new PrismaClient();


async function main() {


  console.log('🌱 Ejecutando seed...');


  /*
  ==========================
  ROLES
  ==========================
  */


  const roles = [
    {
      nombre: 'ADMIN_SAAS',
      descripcion:
        'Administrador global del SaaS',
    },
    {
      nombre: 'ADMIN',
      descripcion:
        'Administrador de empresa',
    },
    {
      nombre: 'ADMIN_EMPRESA',
      descripcion:
        'Administrador operativo',
    },
    {
      nombre: 'VENDEDOR',
      descripcion:
        'Usuario vendedor',
    },
  ];


  const rolesDB:any = {};


  for (const rol of roles) {


    const registro =
      await prisma.roles.upsert({

        where:{
          nombre:
            rol.nombre,
        },

        update:{},

        create:rol,

      });


    rolesDB[rol.nombre] =
      registro;

  }



  /*
  ==========================
  EMPRESA T420 DEMO
  ==========================
  */


  const empresa =
    await prisma.empresas.upsert({

      where:{
        email:
          'admin@t420.local',
      },

      update:{},

      create:{

        razon_social:
          'T420 Demo',

        nombre_comercial:
          'T420 Demo',

        email:
          'admin@t420.local',

        plan_saas:
          'TRIAL',

        estado:
          true,

      },

    });



  /*
  ==========================
  USUARIO ADMIN_SAAS
  ==========================
  */


  const passwordHash =
    await bcrypt.hash(
      'Admin123456',
      10,
    );


  await prisma.usuarios.upsert({

    where:{
      email:
        'admin@t420.local',
    },


    update:{

      id_empresa:
        empresa.id_empresa,

      id_rol:
        rolesDB.ADMIN_SAAS.id_rol,

      password_hash:
        passwordHash,

    },


    create:{

      id_empresa:
        empresa.id_empresa,

      id_rol:
        rolesDB.ADMIN_SAAS.id_rol,

      nombre:
        'Administrador',

      apellido:
        'Principal',

      email:
        'admin@t420.local',

      password_hash:
        passwordHash,

      estado:
        true,

      email_verificado:
        true,

    },

  });



  console.log('✅ Seed terminado');

}


main()
.then(async()=>{

  await prisma.$disconnect();

})
.catch(async(error)=>{

  console.error(error);

  await prisma.$disconnect();

  process.exit(1);

});