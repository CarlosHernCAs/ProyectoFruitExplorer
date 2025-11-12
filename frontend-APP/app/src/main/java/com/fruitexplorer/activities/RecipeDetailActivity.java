package com.fruitexplorer.activities;

import android.os.Bundle;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import com.bumptech.glide.Glide;
import com.fruitexplorer.R;
import com.fruitexplorer.models.Recipe;
import com.google.android.material.appbar.CollapsingToolbarLayout;

public class RecipeDetailActivity extends AppCompatActivity {

    public static final String EXTRA_RECIPE = "extra_recipe";

    private Recipe recipe;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_recipe_detail);

        recipe = getIntent().getParcelableExtra(EXTRA_RECIPE);

        if (recipe == null) {
            Toast.makeText(this, "No se pudo cargar la receta.", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        setupToolbar();
        initViews();
    }

    private void setupToolbar() {
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        CollapsingToolbarLayout collapsingToolbar = findViewById(R.id.collapsing_toolbar);
        collapsingToolbar.setTitle(recipe.getTitle());
    }

    private void initViews() {
        ImageView recipeImageView = findViewById(R.id.recipeImageView);
        TextView recipeDescriptionTextView = findViewById(R.id.recipeDescriptionTextView);
        TextView recipeSourceTextView = findViewById(R.id.recipeSourceTextView);

        recipeDescriptionTextView.setText(recipe.getDescription());
        recipeSourceTextView.setText("Fuente: " + recipe.getSource());

        Glide.with(this).load(recipe.getImageUrl()).into(recipeImageView);
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return true;
    }
}