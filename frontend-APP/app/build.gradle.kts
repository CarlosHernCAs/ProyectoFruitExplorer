plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "com.fruitexplorer"
    compileSdk {
        version = release(36)
    }

    defaultConfig {
        applicationId = "com.fruitexplorer"
        minSdk = 30
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"

        // Configuración de API para diferentes entornos
        // Para localhost en emulador Android: 10.0.2.2:4000
        // Para localhost en dispositivo físico: usa tu IP local (ej: 192.168.x.x:4000)
        buildConfigField("String", "API_BASE_URL", "\"http://10.0.2.2:4000/api/\"")
        buildConfigField("String", "API_BASE_URL_DEVICE", "\"http://192.168.0.100:4000/api/\"")
    }

    buildTypes {
        debug {
            // En desarrollo, usa la URL del emulador por defecto
            buildConfigField("String", "API_BASE_URL", "\"http://10.0.2.2:4000/api/\"")
            buildConfigField("String", "API_BASE_URL_DEVICE", "\"http://192.168.0.100:4000/api/\"")
        }
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            // En producción, usa la URL real del servidor
            buildConfigField("String", "API_BASE_URL", "\"https://fruitexplorer-api.com/api/\"")
            buildConfigField("String", "API_BASE_URL_DEVICE", "\"https://fruitexplorer-api.com/api/\"")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    buildFeatures {
        buildConfig = true
    }
}

dependencies {
    // CameraX core libraries
    val cameraxVersion = "1.5.1"
    implementation("androidx.camera:camera-core:$cameraxVersion")
    implementation("androidx.camera:camera-camera2:$cameraxVersion")
    implementation("androidx.camera:camera-lifecycle:$cameraxVersion")
    implementation("androidx.camera:camera-view:$cameraxVersion")

    // TensorFlow Lite Task Library para visión
    implementation("org.tensorflow:tensorflow-lite-task-vision:0.4.3")

    // Glide para la carga de imágenes desde URL
    implementation("com.github.bumptech.glide:glide:4.12.0")

    // Servicios de Ubicación de Google Play
    implementation("com.google.android.gms:play-services-location:21.0.1")

    // OpenStreetMap SDK (osmdroid)
    implementation("org.osmdroid:osmdroid-android:6.1.18")

    // AndroidX Preference (necesaria para la configuración de osmdroid)
    implementation("androidx.preference:preference-ktx:1.2.1")

    implementation("com.facebook.shimmer:shimmer:0.5.0")



    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.9.3")
    implementation("com.google.android.material:material:1.9.0")
    implementation("androidx.recyclerview:recyclerview:1.3.1")
    implementation(libs.appcompat)
    implementation(libs.activity)
    implementation(libs.constraintlayout)
    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)
}