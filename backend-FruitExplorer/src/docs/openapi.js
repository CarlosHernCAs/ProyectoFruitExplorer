const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'API FruitExplorer',
    description: `
     API del proyecto FruitExplorer — Sistema educativo y de detección de frutas peruanas 🍌🥭🍍

    Desarrollado con Node.js + Express y documentado con Scalar.
    `,
    version: '1.0.0',
    contact: {
      name: 'Carlos Antonio Hernández Castro',
      email: '905953@senati.pe',
    },
  },
  servers: [
    {
      url: 'http://localhost:4000/api',
      description: 'Servidor local de desarrollo',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    '/users': {
      get: {
    summary: 'Listar todos los usuarios (solo admin)',
    tags: ['Usuarios'],
    security: [{ bearerAuth: [] }],
    responses: {
      200: { description: 'Lista de usuarios obtenida' }
    }
  }
    },
    '/users/{id}': {
          get: {
            summary: 'Obtener un usuario por ID',
            tags: ['Usuarios'],
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string' }
              }
            ],
            responses: {
              200: { description: 'Usuario encontrado' },
              404: { description: 'Usuario no encontrado' }
            }
          }
        },
    '/auth/register': {
    post: {
      summary: 'Registrar un nuevo usuario',
      tags: ['Autenticación'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string' },
                password: { type: 'string' },
                display_name: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        201: { description: 'Usuario registrado correctamente' },
        400: { description: 'Datos inválidos o usuario existente' }
      }
    }
  },
  '/auth/login': {
    post: {
      summary: 'Iniciar sesión',
      tags: ['Autenticación'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string' },
                password: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Inicio de sesión exitoso' },
        401: { description: 'Credenciales incorrectas' }
      },
    },
  },
  '/fruits': {
    get: {
      summary: 'Listar frutas',
      tags: ['Frutas'],
      parameters: [
        { name: 'region', in: 'query', schema: { type: 'string' } },
        { name: 'q', in: 'query', schema: { type: 'string' } },
        { name: 'page', in: 'query', schema: { type: 'integer' } },
        { name: 'limit', in: 'query', schema: { type: 'integer' } }
      ],
      responses: { 200: { description: 'Lista de frutas' } }
    },
    post: {
      summary: 'Crear fruta (admin)',
      tags: ['Frutas'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                slug: { type: 'string' },
                common_name: { type: 'string' },
                scientific_name: { type: 'string' },
                description: { type: 'string' },
                nutritional: { type: 'object' },
                image_url: { type: 'string' },
                source_api_url: { type: 'string' }
              },
              required: ['slug', 'common_name']
            }
          }
        }
      },
      responses: { 201: { description: 'Fruta creada' } }
    }
  },
  '/roles': {
  get: {
    summary: 'Listar todos los roles (solo admin)',
    tags: ['Roles'],
    security: [{ bearerAuth: [] }],
    responses: { 200: { description: 'Lista de roles' } }
  },
  post: {
    summary: 'Crear nuevo rol (solo admin)',
    tags: ['Roles'],
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' } } } } }
    },
    responses: { 201: { description: 'Rol creado' } }
  }
},
'/roles/assign': {
  post: {
    summary: 'Asignar rol a usuario (solo admin)',
    tags: ['Roles'],
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              user_id: { type: 'string' },
              role_id: { type: 'integer' }
            }
          }
        }
      }
    },
    responses: { 200: { description: 'Rol asignado' } }
  }
},
'/roles/remove': {
  post: {
    summary: 'Eliminar rol de usuario (solo admin)',
    tags: ['Roles'],
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              user_id: { type: 'string' },
              role_id: { type: 'integer' }
            }
          }
        }
      }
    },
    responses: { 200: { description: 'Rol eliminado' } }
  }
},
'/roles/{id}': {
  delete: {
    summary: 'Eliminar rol del sistema (solo admin)',
    tags: ['Roles'],
    security: [{ bearerAuth: [] }],
    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
    responses: { 200: { description: 'Rol eliminado' } }
  }
},

  '/fruits/{id}': {
    get: {
      summary: 'Obtener fruta por id',
      tags: ['Frutas'],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: { 200: { description: 'Fruta' }, 404: { description: 'No encontrada' } }
    },
    put: {
      summary: 'Actualizar fruta (admin)',
      tags: ['Frutas'],
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
      responses: { 200: { description: 'Actualizada' } }
    },
    delete: {
      summary: 'Eliminar fruta (admin)',
      tags: ['Frutas'],
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: { 200: { description: 'Eliminada' } }
    }
  },
  '/fruits/slug/{slug}': {
    get: {
      summary: 'Obtener fruta por slug',
      tags: ['Frutas'],
      parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Fruta' }, 404: { description: 'No encontrada' } }
    }
  },
  '/fruits/{id}/sync': {
    post: {
      summary: 'Marcar fruta como sincronizada',
      tags: ['Frutas'],
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: { 200: { description: 'Sincronizada' } }
    }
  },
  '/regions': {
  get: {
    summary: 'Listar todas las regiones',
    tags: ['Regiones'],
    security: [{ bearerAuth: [] }],
    responses: { 200: { description: 'Lista de regiones' } }
  },
  post: {
    summary: 'Crear nueva región (solo admin)',
    tags: ['Regiones'],
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              image_url: { type: 'string' },
              geo_polygon: { type: 'string' }
            }
          }
        }
      }
    },
    responses: { 201: { description: 'Región creada correctamente' } }
  }
},
'/regions/{id}': {
  get: {
    summary: 'Obtener una región por ID',
    tags: ['Regiones'],
    security: [{ bearerAuth: [] }],
    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
    responses: { 200: { description: 'Región encontrada' } }
  },
  put: {
    summary: 'Actualizar una región (solo admin)',
    tags: ['Regiones'],
    security: [{ bearerAuth: [] }],
    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              image_url: { type: 'string' },
              geo_polygon: { type: 'string' }
            }
          }
        }
      }
    },
    responses: { 200: { description: 'Región actualizada' } }
  },
  delete: {
    summary: 'Eliminar una región (solo admin)',
    tags: ['Regiones'],
    security: [{ bearerAuth: [] }],
    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
    responses: { 200: { description: 'Región eliminada' } }
  }
},
'/fruits': {
  get: {
    summary: 'Listar todas las frutas',
    tags: ['Frutas'],
    security: [{ bearerAuth: [] }],
    responses: { 200: { description: 'Lista de frutas' } }
  },
  post: {
    summary: 'Registrar nueva fruta (solo admin)',
    tags: ['Frutas'],
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              slug: { type: 'string' },
              common_name: { type: 'string' },
              scientific_name: { type: 'string' },
              description: { type: 'string' },
              nutritional: { type: 'object' },
              image_url: { type: 'string' },
              source_api_url: { type: 'string' }
            }
          }
        }
      }
    },
    responses: { 201: { description: 'Fruta registrada correctamente' } }
  }
},
'/fruits/{id}': {
  get: {
    summary: 'Obtener fruta por ID',
    tags: ['Frutas'],
    security: [{ bearerAuth: [] }],
    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
    responses: { 200: { description: 'Fruta encontrada' } }
  },
  put: {
    summary: 'Actualizar fruta (solo admin)',
    tags: ['Frutas'],
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: { 'application/json': { schema: { type: 'object' } } }
    },
    responses: { 200: { description: 'Fruta actualizada' } }
  },
  delete: {
    summary: 'Eliminar fruta (solo admin)',
    tags: ['Frutas'],
    security: [{ bearerAuth: [] }],
    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
    responses: { 200: { description: 'Fruta eliminada' } }
  }
},
'/fruits/assign-region': {
  post: {
    summary: 'Asignar una fruta a una región (solo admin)',
    tags: ['Frutas'],
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              fruit_id: { type: 'integer' },
              region_id: { type: 'integer' }
            }
          }
        }
      }
    },
    responses: { 200: { description: 'Fruta asignada correctamente' } }
  }
},
'/recipes': {
  get: {
    summary: 'Listar todas las recetas (público)',
    tags: ['Recetas'],
    security: [{ bearerAuth: [] }],
    parameters: [
      { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Buscar por nombre o descripción' },
      { name: 'page', in: 'query', schema: { type: 'integer' }, description: 'Página' },
      { name: 'limit', in: 'query', schema: { type: 'integer' }, description: 'Resultados por página' }
    ],
    responses: { 200: { description: 'Lista de recetas' } }
  },
  post: {
    summary: 'Crear una nueva receta (solo admin)',
    tags: ['Recetas'],
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              source: { type: 'string' },
              image_url: { type: 'string' }
            }
          }
        }
      }
    },
    responses: { 201: { description: 'Receta creada correctamente' } }
  }
},
'/recipes/{id}': {
  get: {
    summary: 'Obtener una receta por ID (público)',
    tags: ['Recetas'],
    security: [{ bearerAuth: [] }],
    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
    responses: { 200: { description: 'Receta encontrada' } }
  },
  put: {
    summary: 'Actualizar una receta (solo admin)',
    tags: ['Recetas'],
    security: [{ bearerAuth: [] }],
    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
    requestBody: {
      required: true,
      content: { 'application/json': { schema: { type: 'object' } } }
    },
    responses: { 200: { description: 'Receta actualizada correctamente' } }
  },
  delete: {
    summary: 'Eliminar una receta (solo admin)',
    tags: ['Recetas'],
    security: [{ bearerAuth: [] }],
    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
    responses: { 200: { description: 'Receta eliminada correctamente' } }
  }
},
'/fruit-recipes': {
  post: {
    summary: 'Asociar fruta con receta (solo admin)',
    tags: ['Frutas y Recetas'],
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              fruit_id: { type: 'integer' },
              recipe_id: { type: 'integer' }
            }
          }
        }
      }
    },
    responses: { 201: { description: 'Fruta asociada correctamente' } }
  },
  delete: {
    summary: 'Eliminar asociación fruta-receta (solo admin)',
    tags: ['Frutas y Recetas'],
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              fruit_id: { type: 'integer' },
              recipe_id: { type: 'integer' }
            }
          }
        }
      }
    },
    responses: { 200: { description: 'Asociación eliminada' } }
  }
},
'/fruit-recipes/by-fruit/{fruit_id}': {
  get: {
    summary: 'Listar recetas asociadas a una fruta',
    tags: ['Frutas y Recetas'],
    security: [{ bearerAuth: [] }],
    parameters: [{ name: 'fruit_id', in: 'path', required: true, schema: { type: 'integer' } }],
    responses: { 200: { description: 'Lista de recetas' } }
  }
},
'/fruit-recipes/by-recipe/{recipe_id}': {
  get: {
    summary: 'Listar frutas asociadas a una receta',
    tags: ['Frutas y Recetas'],
    security: [{ bearerAuth: [] }],
    parameters: [{ name: 'recipe_id', in: 'path', required: true, schema: { type: 'integer' } }],
    responses: { 200: { description: 'Lista de frutas' } }
  }
},

'/recipe-steps/{recipe_id}': {
  get: {
    summary: 'Listar pasos de una receta',
    tags: ['Recetas'],
    security: [{ bearerAuth: [] }],
    parameters: [{ name: 'recipe_id', in: 'path', required: true, schema: { type: 'integer' } }],
    responses: { 200: { description: 'Pasos de la receta' } }
  },
  post: {
    summary: 'Crear paso de receta (solo admin)',
    tags: ['Recetas'],
    security: [{ bearerAuth: [] }],
    parameters: [{ name: 'recipe_id', in: 'path', required: true, schema: { type: 'integer' } }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              step_number: { type: 'integer' },
              description: { type: 'string' }
            }
          }
        }
      }
    },
    responses: { 201: { description: 'Paso agregado correctamente' } }
  }
},
'/recipe-steps/{id}': {
  put: {
    summary: 'Actualizar paso de receta (solo admin)',
    tags: ['Recetas'],
    security: [{ bearerAuth: [] }],
    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: { type: 'object', properties: { description: { type: 'string' } } }
        }
      }
    },
    responses: { 200: { description: 'Paso actualizado correctamente' } }
  },
  delete: {
    summary: 'Eliminar paso de receta (solo admin)',
    tags: ['Recetas'],
    security: [{ bearerAuth: [] }],
    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
    responses: { 200: { description: 'Paso eliminado correctamente' } }
  }
}
  },
  tags: [
    { name: 'Usuarios', description: 'Gestión de usuarios y roles' },
    { name: 'Frutas', description: 'Consulta y administración de frutas' },
    { name: 'Autenticación', description: 'Registro e inicio de sesión de usuarios' }
  ],
};

export default openApiDocument;
