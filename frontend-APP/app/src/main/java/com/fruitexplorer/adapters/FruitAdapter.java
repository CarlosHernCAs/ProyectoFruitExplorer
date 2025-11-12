package com.fruitexplorer.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.fruitexplorer.R;
import com.fruitexplorer.models.Fruit;

import java.util.List;

public class FruitAdapter extends RecyclerView.Adapter<FruitAdapter.FruitViewHolder> {

    private List<Fruit> fruitList;
    private Context context;
    private OnFruitClickListener listener;

    public interface OnFruitClickListener {
        void onFruitClick(Fruit fruit);
    }

    public FruitAdapter(Context context, List<Fruit> fruitList, OnFruitClickListener listener) {
        this.context = context;
        this.fruitList = fruitList;
        this.listener = listener;
    }

    public void updateFruits(List<Fruit> newFruitList) {
        this.fruitList.clear();
        this.fruitList.addAll(newFruitList);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public FruitViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_fruit, parent, false);
        return new FruitViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull FruitViewHolder holder, int position) {
        Fruit fruit = fruitList.get(position);
        holder.bind(fruit, listener);
    }

    @Override
    public int getItemCount() {
        return fruitList.size();
    }

    static class FruitViewHolder extends RecyclerView.ViewHolder {
        ImageView fruitImageView;
        TextView fruitCommonNameTextView;
        TextView fruitScientificNameTextView;

        public FruitViewHolder(@NonNull View itemView) {
            super(itemView);
            fruitImageView = itemView.findViewById(R.id.fruitImageView);
            // Corregimos los IDs para que coincidan con los de item_fruit.xml
            fruitCommonNameTextView = itemView.findViewById(R.id.fruitCommonNameTextView);
            fruitScientificNameTextView = itemView.findViewById(R.id.fruitScientificNameTextView);
        }

        public void bind(final Fruit fruit, final OnFruitClickListener listener) {
            // Asignamos los textos a las vistas correctas
            fruitCommonNameTextView.setText(fruit.getCommonName());
            fruitScientificNameTextView.setText(fruit.getScientificName());

            Glide.with(itemView.getContext())
                    .load(fruit.getImageUrl())
                    .placeholder(android.R.drawable.ic_menu_gallery) // Usar un placeholder estándar y seguro
                    .error(android.R.drawable.ic_menu_gallery)       // Usar un placeholder de error estándar
                    .into(fruitImageView);

            itemView.setOnClickListener(v -> listener.onFruitClick(fruit));
        }
    }
}