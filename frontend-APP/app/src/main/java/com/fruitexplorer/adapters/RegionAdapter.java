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
import com.fruitexplorer.models.Region;

import java.util.List;

public class RegionAdapter extends RecyclerView.Adapter<RegionAdapter.RegionViewHolder> {

    private final Context context;
    private final List<Region> regionList;
    private final OnRegionClickListener listener;

    public interface OnRegionClickListener {
        void onRegionClick(Region region);
    }

    public RegionAdapter(Context context, List<Region> regionList, OnRegionClickListener listener) {
        this.context = context;
        this.regionList = regionList;
        this.listener = listener;
    }

    public void updateRegions(List<Region> newRegionList) {
        this.regionList.clear();
        this.regionList.addAll(newRegionList);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public RegionViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_region, parent, false);
        return new RegionViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull RegionViewHolder holder, int position) {
        Region region = regionList.get(position);
        holder.bind(region, listener);
    }

    @Override
    public int getItemCount() {
        return regionList.size();
    }

    static class RegionViewHolder extends RecyclerView.ViewHolder {
        ImageView regionImageView;
        TextView regionNameTextView;

        public RegionViewHolder(@NonNull View itemView) {
            super(itemView);
            regionImageView = itemView.findViewById(R.id.regionImageView);
            regionNameTextView = itemView.findViewById(R.id.regionNameTextView);
        }

        public void bind(final Region region, final OnRegionClickListener listener) {
            regionNameTextView.setText(region.getName());
            Glide.with(itemView.getContext())
                    .load(region.getImageUrl())
                    .placeholder(android.R.drawable.ic_menu_gallery) // Usar un placeholder estándar
                    .error(android.R.drawable.ic_menu_gallery)       // Usar un placeholder de error estándar
                    .into(regionImageView);

            itemView.setOnClickListener(v -> listener.onRegionClick(region));
        }
    }
}