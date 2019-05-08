module Api::V1
  class ItemsController < ApplicationController
    before_action :set_item, only: [:show, :update, :destroy]

    # GET /items
    def index
      per_page = 10
      items = Item.page(params[:page])
      render json: {items: items, per_page: per_page, count: items.count}
    end

    # GET /items/1
    def show
      render json: @item
    end

    # POST /items
    def create
      @item = Item.new(item_params)

      if @item.save
        render json: @item, status: :created
      else
        render json: @item.errors, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /items/1
    def update
      if @item.update(item_params)
        render json: @item
      else
        render json: @item.errors, status: :unprocessable_entity
      end
    end

    # DELETE /items/1
    def destroy
      @item.destroy
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_item
        @item = Item.find(params[:id])
      end

      # Only allow a trusted parameter "white list" through.
      def item_params
        params.require(:item).permit(:type, :name, :excerpt, :description, :url, :upvotes)
      end
  end
end